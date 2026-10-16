import { createToken, getTokenFromRequest, verifyAuth } from '@/lib/auth';

export async function POST(req) {
  const token = getTokenFromRequest(req);
  const auth = verifyAuth(token);

  if (!auth || auth.role !== 'admin') {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({
    token: createToken(auth.userId, auth.email, auth.role),
  });
}
