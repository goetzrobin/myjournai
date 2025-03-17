export type PersonalContextsListParams = {
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
}
export const personalContextsQKF = {
  list: (userId: string, params?: PersonalContextsListParams) =>
    params ? ['personalContexts', userId, 'list', params] : ['personalContexts', userId, 'list'],
  detail: (id?: string) =>
    ['personalContexts', id]
};
