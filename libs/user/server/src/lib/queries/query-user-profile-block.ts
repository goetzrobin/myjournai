import { queryLatestUserProfileBy } from './user-profile.queries';

export const queryUserProfileBlock = async (userId: string) => {
  const userProfileData = await queryLatestUserProfileBy({ userId });
  return `
This is a comprehensive profile of your mentee's most recent state of mind.
It's informed by the messages you have exchanged with them lately and can be used to
better fit your guidance and conversation style to meet them where they are right now:

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
