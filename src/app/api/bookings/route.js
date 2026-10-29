import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';
import { createBookingExport } from '@/lib/bookingSpreadsheet';
import { sendAdminBookingEmail } from '@/lib/adminBookingNotifications';

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    const auth = verifyAuth(token);

    if (!auth) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    await dbConnect();
    if (new URL(req.url).searchParams.get('format') === 'xlsx') {
      const bookings = await Booking.find().lean();
      const workbook = await createBookingExport(bookings);
      return new Response(workbook, {
        status: 200,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="jg-impact-bookings.xlsx"',
          'Cache-Control': 'no-store',
        },
      });
    }

    const bookings = await Booking.find().populate('assignedTo', 'name email');
    
    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.error('GET bookings error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { fullName, email, phone, serviceType, preferredDate, notes } = 
      await req.json();

    if (!fullName || !phone || !serviceType || !preferredDate) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const booking = new Booking({
      fullName,
      email,
      phone,
      serviceType,
      preferredDate: new Date(preferredDate),
      notes,
      status: 'pending',
      adminNotificationStatus: 'pending',
    });

    await booking.save();

    try {
      const claimedBooking = await Booking.findOneAndUpdate(
        { _id: booking._id, adminNotificationStatus: 'pending' },
        {
          $set: {
            adminNotificationStatus: 'sending',
            adminNotificationClaimedAt: new Date(),
          },
        },
        { new: true }
      );
      if (!claimedBooking) {
        throw new Error('Could not claim the new booking notification.');
      }
      await sendAdminBookingEmail(claimedBooking, 'new');
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
    } catch (error) {
      console.error('New booking admin notification failed; it will be retried:', error);
      try {
        await Booking.updateOne(
          { _id: booking._id, adminNotificationStatus: 'sending' },
          {
            $set: { adminNotificationStatus: 'pending' },
            $unset: { adminNotificationClaimedAt: 1 },
          }
        );
      } catch (resetError) {
        console.error('Could not reset the failed booking email for retry:', resetError);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Booking created successfully',
        booking,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('POST booking error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
