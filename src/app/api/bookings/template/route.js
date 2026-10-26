import { verifyAuth, getTokenFromRequest } from '@/lib/auth';
import { createBookingTemplate } from '@/lib/bookingSpreadsheet';

export async function GET(req) {
  const auth = verifyAuth(getTokenFromRequest(req));

  if (!auth || auth.role !== 'admin') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const workbook = await createBookingTemplate();
    return new Response(workbook, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="jg-impact-booking-template.xlsx"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Create booking template error:', error);
    return Response.json({ message: 'Unable to create the booking template.' }, { status: 500 });
  }
}
