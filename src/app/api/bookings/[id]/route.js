import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';
import { Types } from 'mongoose';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: 'Invalid booking ID' }), {
        status: 400,
      });
    }

    const booking = await Booking.findById(id).populate('assignedTo', 'name email');

    if (!booking) {
      return new Response(JSON.stringify({ message: 'Booking not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(booking), { status: 200 });
  } catch (error) {
    console.error('GET booking error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const token = getTokenFromRequest(req);
    const auth = verifyAuth(token);

    if (!auth) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { id } = params;
    const updates = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: 'Invalid booking ID' }), {
        status: 400,
      });
    }

    const booking = await Booking.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    if (!booking) {
      return new Response(JSON.stringify({ message: 'Booking not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(booking), { status: 200 });
  } catch (error) {
    console.error('PATCH booking error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const token = getTokenFromRequest(req);
    const auth = verifyAuth(token);

    if (!auth) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: 'Invalid booking ID' }), {
        status: 400,
      });
    }

    await Booking.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: 'Booking deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE booking error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
