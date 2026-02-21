import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/prisma';

function signJwt(userDbId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET missing');
  return jwt.sign({ sub: userDbId }, secret, { expiresIn: '7d' });
}

export async function signup(input: {
  userName: string;
  email?: string;
  phone?: string;
  password: string;
}) {
  const userName = input.userName.trim();
  const email = input.email?.toLowerCase().trim();
  const phone = input.phone?.trim();

  if (await prisma.user.findUnique({ where: { userName } }))
    throw new Error('USERNAME_EXISTS');
  if (email && (await prisma.user.findUnique({ where: { email } })))
    throw new Error('EMAIL_EXISTS');
  if (phone && (await prisma.user.findUnique({ where: { phone } })))
    throw new Error('PHONE_EXISTS');

  const hashed = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      userName,
      email: email ?? null,
      phone: phone ?? null,
      password: hashed,
    },
  });

  return { token: signJwt(user.id), user };
}

export async function login(input: {
  email?: string;
  phone?: string;
  password: string;
}) {
  const email = input.email?.toLowerCase().trim();
  const phone = input.phone?.trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter(
        Boolean,
      ) as any,
    },
  });

  if (!user || !user.password) throw new Error('INVALID_CREDENTIALS');

  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw new Error('INVALID_CREDENTIALS');

  return { token: signJwt(user.id), user };
}

export async function changePassword(input: {
  userId: string;
  oldPassword: string;
  newPassword: string;
}) {
  const user = await prisma.user.findUnique({ where: { id: input.userId } });
  if (!user || !user.password) throw new Error('INVALID_CREDENTIALS');

  const ok = await bcrypt.compare(input.oldPassword, user.password);
  if (!ok) throw new Error('WRONG_PASSWORD');

  const hashed = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({
    where: { id: input.userId },
    data: { password: hashed },
  });

  return { success: true };
}
