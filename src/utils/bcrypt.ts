import bcrypt from 'bcryptjs';

export const hashValue = async (password: string, hash: number = 10) =>
  await bcrypt.hash(password, hash);

export const compareValue = async (password: string, hashedPassword: string) =>
  await bcrypt.compare(password, hashedPassword);
