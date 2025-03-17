import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAxios } from '~myjournai/http-client';
import { CohortsListParams, cohortsQKF } from './query-key.factory';

// Types imported from shared package
import { CohortsQueryResult } from '~myjournai/cohorts-shared';

// Query hook for fetching cohorts with pagination
export const useCohortsQuery = ({ params, options }: {
  params: CohortsListParams;
  options?: UseQueryOptions<CohortsQueryResult>;
}) => {
  const axios = useAxios();

  // Build query string from params
  const queryParams = new URLSearchParams();

  // Handle cursor construction internally if createdAt and/or slug are provided
  if (params.createdAt || params.slug) {
    const dateStr = params.createdAt ? params.createdAt.toISOString() : 'null';
    const slug = params.slug || '';
    const constructedCursor = `${dateStr}|${slug}`;

    queryParams.append('cursor', constructedCursor);
  }
  // Otherwise use cursor if provided directly
  else if (params.cursor) {
    queryParams.append('cursor', params.cursor);
  }

  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.direction) queryParams.append('direction', params.direction);

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: cohortsQKF.list(params),
    queryFn: () => axios.get<CohortsQueryResult>(`/api/cohorts?${queryString}`).then(({ data }) => data),
    ...options
  });
};

// Helper function to parse a cursor string back into its components
// This can be useful when navigating through pages and needing to extract info
export const parseCursorString = (cursor: string): { createdAt: Date | null; slug: string } => {
  try {
    const [dateStr, slug] = cursor.split('|');
    let createdAt: Date | null = null;

    if (dateStr && dateStr !== 'null') {
      createdAt = new Date(dateStr);
      // Check if date is valid
      if (isNaN(createdAt.getTime())) {
        createdAt = null;
      }
    }

    return {
      createdAt,
      slug: slug || ''
    };
  } catch (e) {
    console.error('Error parsing cursor string:', e);
    return { createdAt: null, slug: '' };
  }
};

// Helper function to extract components from the nextCursor returned in query results
export const extractCursorComponents = (
  queryResult: CohortsQueryResult
): { createdAt: Date | null; slug: string } | null => {
  if (!queryResult.nextCursor) {
    return null;
  }

  return parseCursorString(queryResult.nextCursor);
};
