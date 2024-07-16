import { queryUserBy } from '@myjournai/user-server';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  return await queryUserBy({ id: userId });
});
