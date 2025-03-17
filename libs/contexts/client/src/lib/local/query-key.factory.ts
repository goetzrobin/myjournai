export type LocalContextsListParams = {
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
  cohortId?: string | null;
}

export const localContextsQKF = {
  list: (userId: string, params?: LocalContextsListParams) =>
    params ? ['localContexts', userId, params.cohortId || 'all', 'list', params] : ['localContexts', userId, 'list'],
  detail: (id?: string) =>
    ['localContexts', id]
};
