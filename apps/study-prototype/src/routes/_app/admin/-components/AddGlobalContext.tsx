import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Form, TextArea, TextField } from '~myjournai/components'; // Using your custom components
import { useGlobalContextUpsertMutation } from '~myjournai/contexts-client';

interface GlobalContextFormData {
  weekNumber: number;
  year: number;
  content: string;
}

export function AddGlobalContext({
                                   onSuccess,
                                   onCancel
                                 }: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const currentYear = new Date().getFullYear();
  const currentWeek = getCurrentWeekNumber();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<GlobalContextFormData>({
    defaultValues: {
      weekNumber: currentWeek,
      year: currentYear,
      content: ''
    }
  });

  const upsertMutation = useGlobalContextUpsertMutation({
    onSuccess: () => {
      reset();
      onSuccess?.();
    }
  });

  const onSubmit = (data: GlobalContextFormData) => {
    upsertMutation.mutate(data);
  };

  // Get current week number
  function getCurrentWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000; // milliseconds in a week
    return Math.ceil((diff + (start.getDay() * 86400000)) / oneWeek);
  }

  return (
    <div className="space-y-4">
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                         field: { value, onChange, onBlur, name },
                         fieldState: { error }
                       }) => (
                <TextField
                  label="Year"
                  inputClassName="px-3 py-2"
                  errorMessage={error?.message}
                  isInvalid={!!error}
                  isRequired
                  name={name}
                  placeholder="Enter year"
                  type="number"
                  value={value + ''}
                  onChange={(e) => onChange(parseInt(e) || '')}
                  onBlur={onBlur}
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
                         field: { value, onChange, onBlur, name },
                         fieldState: { error }
                       }) => (
                <TextField
                  label="Week Number"
                  inputClassName="px-3 py-2"
                  errorMessage={error?.message}
                  isInvalid={!!error}
                  isRequired
                  value={value + ''}
                  name={name}
                  onChange={(e) => onChange(parseInt(e))}
                  placeholder="Enter week number"
                    onBlur={onBlur}
/>
              )}
            />
          </div>
        </div>

        <div>
          <Controller
            control={control}
            name="content"
            rules={{
              required: 'Content is required',
              minLength: { value: 10, message: 'Content must be at least 10 characters' }
            }}
            render={({
                       field: { value, onChange, onBlur },
                       fieldState: { error }
                     }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Content</label>
                <TextArea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  placeholder="Enter global context content"
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
            variant="primary"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Context'}
          </Button>
        </div>
      </Form>

      {upsertMutation.isError && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded">
          Error saving context: {upsertMutation.error?.message || 'Unknown error'}
        </div>
      )}
    </div>
  );
}
