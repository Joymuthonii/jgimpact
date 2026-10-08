import dbConnect from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';
import { Types } from 'mongoose';

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: 'Invalid contact ID' }), {
        status: 400,
      });
    }

    const contact = await Contact.findById(id).populate('respondedBy', 'name email');

    if (!contact) {
      return new Response(JSON.stringify({ message: 'Contact not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(contact), { status: 200 });
  } catch (error) {
    console.error('GET contact error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

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
      return new Response(JSON.stringify({ message: 'Invalid contact ID' }), {
        status: 400,
      });
    }

    // Add respondedBy and respondedAt if responding to the contact
    if (updates.response && !updates.respondedBy) {
      updates.respondedBy = auth.userId;
      updates.respondedAt = new Date();
      updates.status = 'responded';
    }

    const contact = await Contact.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('respondedBy', 'name email');

    if (!contact) {
      return new Response(JSON.stringify({ message: 'Contact not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(contact), { status: 200 });
  } catch (error) {
    console.error('PATCH contact error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const token = getTokenFromRequest(req);
    const auth = verifyAuth(token);

    if (!auth) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: 'Invalid contact ID' }), {
        status: 400,
      });
    }

    await Contact.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: 'Contact deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE contact error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
