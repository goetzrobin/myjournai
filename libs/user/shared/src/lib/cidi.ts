import { insertCidiSurveyResponsesSchema } from '~db/schema/cidi-survey-responses';
import { z } from 'zod';

export type CreateUserCidiResponseRequest = z.infer<typeof insertCidiSurveyResponsesSchema>;
