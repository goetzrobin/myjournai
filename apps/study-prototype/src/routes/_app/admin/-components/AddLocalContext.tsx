import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextArea, TextField } from '~myjournai/components';
import { useLocalContextUpsertMutation } from '~myjournai/contexts-client';

interface LocalContextFormData {
  content: string;
  weekNumber: number;
  year: number;
}

export function AddLocalContext({
                                  cohortId,
                                  onSuccess,
                                  onCancel
                                }: {
  cohortId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const currentYear = new Date().getFullYear();
  const currentWeek = getCurrentWeekNumber();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<LocalContextFormData>({
    defaultValues: {
      content: '',
      weekNumber: currentWeek,
      year: currentYear
    }
  });

  const upsertMutation = useLocalContextUpsertMutation({
    cohortId,
    onSuccess: () => {
      reset();
      onSuccess?.();
    }
  });

  const onSubmit = (data: LocalContextFormData) => {
    if (!cohortId) return;

    upsertMutation.mutate({
      content: data.content,
      weekNumber: data.weekNumber,
      year: data.year
    });
  };

  // Get current week number
  function getCurrentWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000; // milliseconds in a week
    return Math.ceil((diff + (start.getDay() * 86400000)) / oneWeek);
  }

  if (!cohortId) {
    return <div>No cohort selected</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <Controller
              control={control}
              name="year"
              rules={{
                required: 'Year is required',
                min: { value: 2000, message: 'Year must be 2000 or later' },
                max: { value: currentYear + 5, message: `Year cannot be more than ${currentYear + 5}` }
              }}
              render={({
                         field: { onChange, value, name, onBlur },
                         fieldState: { error }
                       }) => (
                <TextField
                  label="Year"
                  placeholder="Enter year"
                  value={value.toString()}
                  onChange={(val) => onChange(parseInt(val) || currentYear)}
                  onBlur={onBlur}
                  name={name}
                  isRequired
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  inputClassName="px-3 py-2 dark:bg-zinc-900"
                />
              )}
            />
          </div>

          <div className="w-1/2">
            <Controller
              control={control}
              name="weekNumber"
              rules={{
                required: 'Week number is required',
                min: { value: 1, message: 'Week must be between 1-53' },
                max: { value: 53, message: 'Week must be between 1-53' }
              }}
              render={({
                         field: { onChange, value, name, onBlur },
                         fieldState: { error }
                       }) => (
                <TextField
                  label="Week Number"
                  placeholder="Enter week number"
                  value={value.toString()}
                  onChange={(val) => onChange(parseInt(val) || currentWeek)}
                  onBlur={onBlur}
                  name={name}
                  isRequired
                  isInvalid={!!error}
                  errorMessage={error?.message}
                  inputClassName="px-3 py-2 dark:bg-zinc-900"
                />
              )}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Content</label>
          <Controller
            control={control}
            name="content"
            rules={{
              required: 'Content is required',
              minLength: { value: 10, message: 'Content must be at least 10 characters' }
            }}
            render={({
                       field: { onChange, value, onBlur },
                       fieldState: { error }
                     }) => (
              <div className="flex flex-col gap-1">
                <TextArea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  placeholder="Enter local context content"
                  className="w-full"
                  rows={10}
                />
                {error && <p className="text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button
              type="button"
              onPress={onCancel}
              variant="ghost"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Context'}
          </Button>
        </div>
      </form>

      {upsertMutation.isError && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded">
          Error saving context: {upsertMutation.error?.message || 'Unknown error'}
        </div>
      )}
    </div>
  );
}
