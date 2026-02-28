import { Decimal } from '@prisma/client/runtime/client';

export interface User {
  userId: string;
  email: string;
  phone: string | null;
  role: 'nutritionist' | 'patient' | 'admin';
  is2faEnabled: boolean;
  twoFaSecret: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface Patient {
  patientId: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: string | null;
  bloodType: string | null;
  chronicDiseases: string[];
  isProfileComplete: boolean;
  deletedAt: Date | null;
}

export interface Nutritionist {
  nutritionistId: string;
  userId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string | null;
  licenseDocumentUrl: string | null;
  consultationFee: Decimal;
  verificationStatus: string;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface UserWithRelation extends User {
  patient?: Patient | null;
  nutritionist?: Nutritionist | null;
}
