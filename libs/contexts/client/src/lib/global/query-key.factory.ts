export type GlobalContextsListParams = {
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
}
export const globalContextsQKF = {
  list: (params?: GlobalContextsListParams) =>
    params ? ['globalContexts', 'list', params] : ['globalContexts', 'list'],
  detail: (id?: string) =>
    ['globalContexts', id]
};
