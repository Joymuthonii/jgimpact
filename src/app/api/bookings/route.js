import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';
import { createBookingExport } from '@/lib/bookingSpreadsheet';

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
    });

    await booking.save();

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
