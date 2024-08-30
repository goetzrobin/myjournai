import { queryLatestUserProfileBy } from './user-profile.queries';

export const queryUserProfileBlock = async (userId: string) => {
  const userProfileData = await queryLatestUserProfileBy({ userId });
  return `
  Current State of Mind:
  ${userProfileData?.currentStateOfMind}

  Current Perceived Career Readiness:
  ${userProfileData?.perceivedCareerReadiness}

  Current Core Values:
  ${userProfileData?.coreValues}

  Current Aspirations:
  ${userProfileData?.aspirations}
  `;
}
