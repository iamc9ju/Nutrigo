export const TIME_CONSTANTS = {
  MS: {
    ONE_SECOND: 1000,
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  },
  SECONDS: {
    ONE_MINUTE: 60,
    ONE_HOUR: 60 * 60,
    ONE_DAY: 24 * 60 * 60,
  },
} as const;

export const AUTH_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN_MS: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRES_IN_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
