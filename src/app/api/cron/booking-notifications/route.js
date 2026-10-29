import { timingSafeEqual } from 'node:crypto';
import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { sendAdminBookingEmail } from '@/lib/adminBookingNotifications';

const CLAIM_TIMEOUT_MS = 15 * 60 * 1000;
const MAX_EMAILS_PER_RUN = 50;
const REMINDER_LEAD_TIME_MS = 24 * 60 * 60 * 1000;

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  const authorization = req.headers.get('authorization') || '';
  if (!secret || !authorization.startsWith('Bearer ')) return false;

  const supplied = Buffer.from(authorization.slice('Bearer '.length));
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function sendPendingNotifications(now) {
  let sentCount = 0;
  let failedCount = 0;
  const staleClaim = new Date(now.getTime() - CLAIM_TIMEOUT_MS);

  for (let attempt = 0; attempt < MAX_EMAILS_PER_RUN; attempt += 1) {
    const booking = await Booking.findOneAndUpdate(
      {
        adminNotificationStatus: { $in: ['pending', 'sending'] },
        $or: [
          { adminNotificationStatus: 'pending' },
          { adminNotificationClaimedAt: { $lte: staleClaim } },
        ],
      },
      {
        $set: {
          adminNotificationStatus: 'sending',
          adminNotificationClaimedAt: now,
        },
      },
      { new: true, sort: { createdAt: 1 } }
    );
    if (!booking) break;

    try {
      await sendAdminBookingEmail(booking, 'new');
      await Booking.updateOne(
        { _id: booking._id, adminNotificationStatus: 'sending' },
        {
          $set: {
            adminNotificationStatus: 'sent',
            adminNotificationSentAt: new Date(),
          },
          $unset: { adminNotificationClaimedAt: 1 },
        }
      );
      sentCount += 1;
    } catch (error) {
      failedCount += 1;
      console.error(`Retrying new booking notification for ${booking._id} later:`, error);
      await Booking.updateOne(
        { _id: booking._id, adminNotificationStatus: 'sending' },
        {
          $set: { adminNotificationStatus: 'pending' },
          $unset: { adminNotificationClaimedAt: 1 },
        }
      );
    }
  }

  return { sentCount, failedCount };
}

async function sendDueReminders(now) {
  let sentCount = 0;
  let failedCount = 0;
  const staleClaim = new Date(now.getTime() - CLAIM_TIMEOUT_MS);
  const reminderDeadline = new Date(now.getTime() + REMINDER_LEAD_TIME_MS);

  for (let attempt = 0; attempt < MAX_EMAILS_PER_RUN; attempt += 1) {
    const booking = await Booking.findOneAndUpdate(
      {
        status: { $in: ['pending', 'confirmed'] },
        preferredDate: { $gt: now, $lte: reminderDeadline },
        $or: [
          { adminReminderStatus: 'pending' },
          { adminReminderStatus: { $exists: false } },
          {
            adminReminderStatus: 'sending',
            adminReminderClaimedAt: { $lte: staleClaim },
          },
        ],
      },
      {
        $set: {
          adminReminderStatus: 'sending',
          adminReminderClaimedAt: now,
        },
      },
      { new: true, sort: { preferredDate: 1 } }
    );
    if (!booking) break;

    try {
      await sendAdminBookingEmail(booking, 'reminder');
      await Booking.updateOne(
        { _id: booking._id, adminReminderStatus: 'sending' },
        {
          $set: {
            adminReminderStatus: 'sent',
            adminReminderSentAt: new Date(),
          },
          $unset: { adminReminderClaimedAt: 1 },
        }
      );
      sentCount += 1;
    } catch (error) {
      failedCount += 1;
      console.error(`Retrying session reminder for ${booking._id} later:`, error);
      await Booking.updateOne(
        { _id: booking._id, adminReminderStatus: 'sending' },
        {
          $set: { adminReminderStatus: 'pending' },
          $unset: { adminReminderClaimedAt: 1 },
        }
      );
    }
  }

  return { sentCount, failedCount };
}

export async function GET(req) {
  if (!process.env.CRON_SECRET) {
    console.error('CRON_SECRET is not configured.');
    return Response.json({ message: 'Notification scheduler is not configured.' }, { status: 500 });
  }
  if (!isAuthorized(req)) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const now = new Date();
    const newBookingNotifications = await sendPendingNotifications(now);
    const reminders = await sendDueReminders(now);
    const failedCount =
      newBookingNotifications.failedCount + reminders.failedCount;

    return Response.json(
      {
        newBookingNotifications: newBookingNotifications.sentCount,
        reminders: reminders.sentCount,
        failedCount,
      },
      { status: failedCount > 0 ? 503 : 200 }
    );
  } catch (error) {
    console.error('Booking notification scheduler error:', error);
    return Response.json({ message: 'Unable to process booking notifications.' }, { status: 500 });
  }
}
