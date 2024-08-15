import { queryUserProfileBy } from './profile/user-profile.queryhandler';

export const getUserProfileBlock = async (userId: string) => {
  const userProfileData = await queryUserProfileBy({ userId });
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
