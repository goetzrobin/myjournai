export type CohortsListParams = {
  // Original cursor parameter (internal use)
  cursor?: string;
  // New user-friendly parameters
  createdAt?: Date;
  slug?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
}

export const cohortsQKF = {
  list: (params?: CohortsListParams) =>
    params ? ['cohorts', 'list', params] : ['cohorts', 'list'],
  detail: (id?: string) =>
    ['cohorts', id]
};
