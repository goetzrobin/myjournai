import { eventHandler, getRouterParam } from 'h3';
import { queryAllUnguidedSessionLogsBy } from '~myjournai/sessionlog-server';

export default eventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  console.log(`[users-userid-session-logs-unguided] querying unguided session logs for user ${userId}`)
  const logs = await queryAllUnguidedSessionLogsBy({ userId });
  console.log(`[users-userid-session-logs-unguided] found ${logs.length} unguided session logs for user ${userId}`);
  return logs
});
