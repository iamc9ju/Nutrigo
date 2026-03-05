export const RESPONSE_MESSAGE_METADATA = 'response_message_metadata_key';

export const SuccessMessages = {
  GENERAL: 'Operation completed successfully',

  APP: {
    HEALTH_CHECK: 'Service is running normally',
  },

  HEALTH: {
    STATUS: 'System health status retrieved successfully',
  },

  AUTH: {
    REGISTER: 'User registered successfully',
    LOGIN: 'Authentication successful',
    LOGOUT: 'Logged out successfully',
    LOGOUT_ALL: 'Logged out from all devices successfully',
    REFRESH: 'Session refreshed successfully',
    GET_ME: 'Current user profile retrieved successfully',
  },

  PATIENTS: {
    PROFILE_COMPLETED: 'Patient profile completed successfully',
    PROFILE_RETRIEVED: 'Patient profile retrieved successfully',
  },

  HEALTH_METRICS: {
    CREATED: 'Health metric recorded successfully',
    RETRIEVED_ALL: 'Health metrics retrieved successfully',
    RETRIEVED_LATEST: 'Latest health metric retrieved successfully',
    RETRIEVED_ONE: 'Health metric details retrieved successfully',
    UPDATED: 'Health metric updated successfully',
    DELETED: 'Health metric deleted successfully',
  },

  NUTRITIONISTS: {
    RETRIEVED_ALL: 'Nutritionists retrieved successfully',
    RETRIEVED_ONE: 'Nutritionist details retrieved successfully',
    RETRIEVED_AVAILABILITY: 'Nutritionist availability retrieved successfully',
    SCHEDULE_CREATED: 'Nutritionist working schedule created successfully',
    LEAVE_CREATED: 'Nutritionist leave period scheduled successfully',
  },
} as const;

export const ErrorCodes = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  PRISMA_UNIQUE_CONSTRAINT: 'PRISMA_UNIQUE_CONSTRAINT',
  PRISMA_RECORD_NOT_FOUND: 'PRISMA_RECORD_NOT_FOUND',
} as const;

export const ErrorMessages = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  PROCESSING_ERROR: 'Something went wrong processing your request',
  PRISMA: {
    UNIQUE_CONSTRAINT:
      'Data constraint conflict (e.g., duplicated unique field)',
    RECORD_NOT_FOUND: 'Requested database record does not exist',
    OPERATION_FAILED: 'Database operation failed',
  },
  AUTH: {
    EMAIL_IN_USE: 'อีเมลนี้ถูกใช้งานแล้ว',
    PHONE_IN_USE: 'เบอร์โทรศัพท์หล่านี้ถูกใช้งานแล้ว',
    INVALID_CREDENTIALS: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    INVALID_REFRESH_TOKEN_FORMAT: 'Invalid refresh token format',
    TOKEN_EXPIRED_REVOKED: 'Refresh token expired or revoked',
    TOKEN_REUSE_DETECTED: 'Token reuse detected - all sessions revoked',
    USER_NOT_FOUND: 'User not found',
    FORBIDDEN: 'คุณไม่มีสิทธิ์เข้าถึงเนื้อหานี้',
  },
  PATIENTS: {
    NOT_FOUND: 'Patient not found',
    PROFILE_INCOMPLETE:
      'Patient profile not found or incomplete. Please complete your profile first.',
  },
  NUTRITIONISTS: {
    NOT_FOUND: 'Nutritionist not found',
    NOT_FOUND_OR_APPROVED: 'Nutritionist not found or not approved',
  },
  APPOINTMENTS: {
    TIME_SLOT_TAKEN: 'This time slot has already been booked',
    PAST_TIME_NOT_ALLOWED: 'Cannot book an appointment in the past',
    OUTSIDE_WORKING_HOURS:
      'The requested time is outside the nutritionist working hours',
    NUTRITIONIST_ON_LEAVE:
      'The nutritionist is on leave during the requested time',
    SCHEDULE_NOT_FOUND: 'Nutritionist does not work on this day',
    NOT_FOUND: 'Appointment not found',
  },
} as const;
