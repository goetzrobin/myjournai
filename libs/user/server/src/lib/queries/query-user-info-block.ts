import { queryUserBy } from './user.queries';
//TODO: need to figure out a better way to do this and avoid circular dep
import { queryOnboardingLetterBy } from './user-profile.queries';

export const queryUserInfoBlock = async (userId: string) => {
  const [user, letter] = await Promise.all([queryUserBy({ id: userId }), queryOnboardingLetterBy({ userId })]);
  const yearsSinceGrad = user?.graduationYear ? new Date().getFullYear() - user?.graduationYear : undefined;
  return `
      What you know about the user:
      Their Name: ${user?.name ?? 'Not known'}
      Their Birthday: ${user?.graduationYear ? (new Date().getFullYear() - user?.graduationYear) : 'Not known'}
      Gender Identity: ${user?.genderIdentity ?? 'Not known'}
      Pronouns: ${user?.pronouns ?? 'Not known'}
      Ethnicity: ${user?.ethnicity ?? 'Not known'}
      ${yearsSinceGrad === undefined ? 'Year since graduation: Not known' : yearsSinceGrad > 0 ? 'Years since graduation: ' + yearsSinceGrad : 'Years until graduation: ' + yearsSinceGrad}
      NCAA Division: ${user?.ncaaDivision ?? 'Not known'}

      They wrote the following letter to introduce themselves:
      ${letter?.content}`;
};

export const queryBasicUserInfoBlock = async (userId: string) => {
  const user = await queryUserBy({ id: userId });
  const yearsSinceGrad = user?.graduationYear ? new Date().getFullYear() - user?.graduationYear : undefined;
  return `
      What you know about the user:
      Their Name: ${user?.name ?? 'Not known'}
      Their Birthday: ${user?.graduationYear ? (new Date().getFullYear() - user?.graduationYear) : 'Not known'}
      Gender Identity: ${user?.genderIdentity ?? 'Not known'}
      Pronouns: ${user?.pronouns ?? 'Not known'}
      Ethnicity: ${user?.ethnicity ?? 'Not known'}
      ${yearsSinceGrad === undefined ? 'Year since graduation: Not known' : yearsSinceGrad > 0 ? 'Years since graduation: ' + yearsSinceGrad : 'Years until graduation: ' + yearsSinceGrad}
      NCAA Division: ${user?.ncaaDivision ?? 'Not known'}
      `
};
