import { eventHandler, getRouterParam } from 'h3';
import { queryAllUnguidedSessionLogsBy } from '~myjournai/sessionlog-server';

export default eventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  console.log(`fetching uguided session for user ${userId}`)
  const logs = await queryAllUnguidedSessionLogsBy({ userId });
  console.log(`found ${logs}`)
  return logs
});
