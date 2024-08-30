import { Session } from '~db/schema/sessions';
import { SessionLog } from '~db/schema/session-logs';

export type SessionWithLogs = Session & {logs: SessionLog[]}
