import React, { useState } from 'react';
import { Button, Cell, Column, Row, Table, TableHeader } from '~myjournai/components';
import { useLocalContextsQuery } from '~myjournai/contexts-client';
import { useAuthUserIdFromHeaders } from '~myjournai/auth-client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableBody } from 'react-aria-components';

interface LocalContextsTableProps {
  cohortId: string | null;
}

export function LocalContextsTable({ cohortId }: LocalContextsTableProps) {
  const userId = useAuthUserIdFromHeaders();
  const [paginationParams, setPaginationParams] = useState({
    cursor: undefined as string | undefined,
    limit: 10,
    direction: 'forward' as 'forward' | 'backward'
  });

  const localContextsQuery = useLocalContextsQuery({
    userId: userId!,
    params: {
      ...paginationParams,
      cohortId // Add cohortId to the query params
    },
  });

  const contexts = localContextsQuery.data?.items || [];
  const nextCursor = localContextsQuery.data?.nextCursor;
  const prevCursor = paginationParams.cursor;

  const handleNextPage = () => {
    if (nextCursor) {
      setPaginationParams({
        ...paginationParams,
        cursor: nextCursor,
        direction: 'forward'
      });
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      setPaginationParams({
        ...paginationParams,
        cursor: prevCursor,
        direction: 'backward'
      });
    }
  };

  const truncateContent = (content: string, maxLength = 100) => {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  if (!cohortId) {
    return <div className="text-gray-500 dark:text-zinc-400 italic text-center p-6">Please select a cohort to view local contexts</div>;
  }

  return localContextsQuery.isLoading ? (
        <div className="p-4 text-center">Loading contexts...</div>
      ) : localContextsQuery.isError ? (
        <div className="p-4 text-center text-red-500">
          Error loading contexts: {localContextsQuery.error?.message || 'Unknown error'}
        </div>
      ) : contexts.length === 0 ? (
        <div className="p-4 text-center">No contexts found</div>
      ) : (
        <div className="w-fit">
          <Table aria-label="Global Contexts">
            <TableHeader>
              <Column isRowHeader>Year/Week</Column>
              <Column isRowHeader>Content</Column>
              <Column isRowHeader>Updated</Column>
              <Column isRowHeader>Created</Column>
            </TableHeader>
            <TableBody items={contexts}>
              {(context) =>
                <Row key={context.id} id={context.id}>
                  <Cell>{context.year} / W{context.weekNumber}</Cell>
                  <Cell>{truncateContent(context.content)}</Cell>
                  <Cell><>{context.updatedAt}</></Cell>
                  <Cell><>{context.createdAt}</></Cell>
                </Row>
              }
            </TableBody>

          </Table>

          <div className="flex justify-end space-x-2 items-center pt-4">
            <Button
              onPress={handlePrevPage}
              isDisabled={!prevCursor || localContextsQuery.isLoading}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onPress={handleNextPage}
              isDisabled={!nextCursor || localContextsQuery.isLoading}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )
}
