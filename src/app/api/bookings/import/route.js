import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';
import { MAX_BOOKING_IMPORT_ROWS, parseBookingWorkbook } from '@/lib/bookingSpreadsheet';

const MAX_WORKBOOK_SIZE = 10 * 1024 * 1024;

export async function POST(req) {
  const auth = verifyAuth(getTokenFromRequest(req));

  if (!auth || auth.role !== 'admin') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const contentLength = Number(req.headers.get('content-length'));
  if (contentLength > MAX_WORKBOOK_SIZE + 64 * 1024) {
    return Response.json(
      { message: 'Excel workbooks must be 10 MB or smaller.' },
      { status: 413 }
    );
  }

  let bookings;
  let invalidRows;
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return Response.json({ message: 'Select an Excel workbook to import.' }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      return Response.json(
        { message: 'Upload an Excel workbook in .xlsx format.' },
        { status: 400 }
      );
    }
    if (file.size > MAX_WORKBOOK_SIZE) {
      return Response.json(
        { message: 'Excel workbooks must be 10 MB or smaller.' },
        { status: 400 }
      );
    }

    ({ bookings, invalidRows } = await parseBookingWorkbook(await file.arrayBuffer()));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'The Excel workbook could not be read.';
    return Response.json({ message }, { status: 400 });
  }

  if (bookings.length > MAX_BOOKING_IMPORT_ROWS) {
    return Response.json(
      { message: `Import no more than ${MAX_BOOKING_IMPORT_ROWS} bookings at a time.` },
      { status: 400 }
    );
  }

  if (invalidRows.length > 0) {
    return Response.json(
      {
        message: 'No bookings were imported. Correct the listed rows and try again.',
        invalidRows,
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const insertedBookings = await Booking.insertMany(bookings, { ordered: true });
    return Response.json(
      {
        message: `${insertedBookings.length} bookings imported successfully.`,
        importedCount: insertedBookings.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Import bookings error:', error);
    return Response.json({ message: 'Unable to import bookings.' }, { status: 500 });
  }
}
