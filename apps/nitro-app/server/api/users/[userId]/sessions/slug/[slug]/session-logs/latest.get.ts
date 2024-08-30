import { eventHandler, getRouterParam } from 'h3';
import { queryMostRecentSessionLogBy } from '~myjournai/sessionlog-server';

export default eventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const sessionSlug = getRouterParam(event, 'slug');
  return await queryMostRecentSessionLogBy({ sessionSlug, userId });
});
