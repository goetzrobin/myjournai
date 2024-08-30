export const sessionQKF = {
  withLogsList: (userId?: string | null) => ['users', userId, 'sessionsWithLogs', 'list'],
  logDetailMessages: (sessionLogId?: string | null) => ['sessionLogs', sessionLogId, 'messages'],
  logDetails: (userId?: string | null) => ['users', userId, 'sessionLogs'],
  logDetailBySlug: (slug?: string | null, userId?: string | null) => ['users', userId, 'sessionLogs', 'slug', slug]
};
