import dbConnect from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { verifyAuth, getTokenFromRequest } from '@/lib/auth';

export async function GET(req) {
  await dbConnect();

  try {
    const token = getTokenFromRequest(req);
    const auth = verifyAuth(token);

    if (!auth) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const contacts = await Contact.find().populate('respondedBy', 'name email');
    
    return new Response(JSON.stringify(contacts), { status: 200 });
  } catch (error) {
    console.error('GET contacts error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { fullName, email, phone, subject, message } = await req.json();

    if (!fullName || !email || !phone || !subject || !message) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const contact = new Contact({
      fullName,
      email,
      phone,
      subject,
      message,
      status: 'new',
    });

    await contact.save();

    return new Response(
      JSON.stringify({
        message: 'Contact message received. We will get back to you soon.',
        contact,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('POST contact error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
