import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useCohortsQuery } from '~myjournai/cohorts-client';
import { Select, SelectItem } from '~myjournai/components';
import { LocalContextsTable } from './-components/LocalContextsTable';
import { LocalContextModal } from './-components/LocalContextModal';

export const Route = createFileRoute('/_app/admin/local-contexts')({
  component: LocalContextsComponent
});

function LocalContextsComponent() {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [paginationParams] = useState({
    limit: 100,
    direction: 'forward' as 'forward' | 'backward',
    createdAt: undefined as Date | undefined,
    slug: undefined as string | undefined
  });

  const cohortsQuery = useCohortsQuery({
    params: paginationParams
  });

  const cohorts = cohortsQuery.data?.items || [];
  const isLoading = cohortsQuery.isLoading;

  const handleSelectChange = (value: string) => {
    setSelectedCohortId(value);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cohort Local Contexts</h1>

        <div className="mb-4 flex items-start justify-between">
          <Select
            label="Select Cohort"
            isDisabled={isLoading}
            selectedKey={selectedCohortId}
            onSelectionChange={handleSelectChange}
            items={cohorts}
            placeholder={isLoading ? 'Loading cohorts...' : 'Select a cohort'}
            errorMessage={cohortsQuery.isError ? cohortsQuery.error?.message || 'Failed to load cohorts' : undefined}
          >
            {(cohort) => (
              <SelectItem id={cohort.id} value={cohort} textValue={cohort.name || cohort.slug || ''}>
                <div className="flex flex-col">
                  <span className="font-medium">{cohort.name || cohort.slug}</span>
                  {cohort.name && (
                    <span className="text-sm text-gray-500 dark:text-zinc-400 truncate">
                      {cohort.slug}
                    </span>
                  )}
                </div>
              </SelectItem>
            )}
          </Select>

          <LocalContextModal cohortId={selectedCohortId} cohortName={cohorts.find(c => c.id === selectedCohortId)?.name ?? ''}/>
        </div>

        <LocalContextsTable cohortId={selectedCohortId} />


    </div>
  );
}
