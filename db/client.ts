import { drizzle } from 'drizzle-orm/postgres-js';
// @ts-ignore
import postgres from 'postgres';
import { cidiSurveyResponses } from './schema/cidi-survey-responses';
import { cohorts } from './schema/cohorts';
import { cohortsUsers } from './schema/cohorts-users';
import { llmInteractionToolCallResults } from './schema/llm-interaction-tool-call-results';
import { llmInteractionToolCalls } from './schema/llm-interaction-tool-calls';
import { llmInteractionWarnings } from './schema/llm-interaction-warnings';
import { llmInteractions } from './schema/llm-interactions';
import { messageRuns } from './schema/message-runs';
import { onboardingLetters } from './schema/onboarding-letters';
import { sessionLogRelations, sessionLogs } from './schema/session-logs';
import { sessions, sessionsRelations } from './schema/sessions';
import { userProfiles } from './schema/user-profiles';
import { users } from './schema/users';

const connectionString = process.env['NITRO_DATABASE_URL']!;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, {
  schema: {
    cidiSurveyResponses,
    cohorts,
    cohortsUsers,
    llmInteractionToolCallResults,
    llmInteractionToolCalls,
    llmInteractionWarnings,
    llmInteractions,
    messageRuns,
    onboardingLetters,
    sessionLogs,
    sessionLogRelations,
    sessions,
    sessionsRelations,
    userProfiles,
    users
  }
});
