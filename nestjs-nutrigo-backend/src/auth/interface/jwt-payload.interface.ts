export interface JwtPayload {
  sub: string; // userId จาก JWT
  email: string; // email ของ user
  role: string; // role ของ user เช่น 'patient', 'admin'
  iat?: number; // issued at (optional)
  exp?: number; // expiration time (optional)
}
