import dbConnect from '@/lib/db';
import Service from '@/lib/models/Service';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';
import { Types } from 'mongoose';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: 'Invalid service ID' }), {
        status: 400,
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return new Response(JSON.stringify({ message: 'Service not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(service), { status: 200 });
  } catch (error) {
    console.error('GET service error:', error);
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
      return new Response(JSON.stringify({ message: 'Invalid service ID' }), {
        status: 400,
      });
    }

    const service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return new Response(JSON.stringify({ message: 'Service not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(service), { status: 200 });
  } catch (error) {
    console.error('PATCH service error:', error);
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
      return new Response(JSON.stringify({ message: 'Invalid service ID' }), {
        status: 400,
      });
    }

    await Service.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: 'Service deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE service error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
