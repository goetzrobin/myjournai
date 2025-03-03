import { db } from '~db/client';
import { and, eq, inArray } from 'drizzle-orm';
import { UserInterest, userInterests, userUserInterests } from '~db/schema/user-interests';

export type SyncUserInterestsCommand = {
  userId: string;
  interestNames: string[];
};

/**
 * Syncs a user's interests with the provided list of interest names.
 * - Validates all interests exist in the database
 * - Creates new connections for interests not already connected to the user
 * - Sets status to 'removed' for interests not in the provided list
 * - Returns the current set of interests after sync operations
 *
 * @param command Object containing userId and array of interest names
 * @returns Object containing arrays of created, removed, and current user-interest connections
 * @throws Error if any of the provided interests don't exist in the database
 */
export const syncUserInterestsUsecase = async ({
                                                 userId,
                                                 interestNames
                                               }: SyncUserInterestsCommand): Promise<UserInterest[]> => {
  // Validate inputs
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!Array.isArray(interestNames)) {
    throw new Error('Interest names must be an array');
  }

  // Empty array is allowed - it will clear all user interests

  // Use a transaction to ensure data integrity
  return await db.transaction(async (tx) => {
    // 1. Fetch all interests from the database (there should be < 200)
    // Left join with the user's active interests to get their current status
    const allInterests = await tx
      .select()
      .from(userInterests)
      .leftJoin(
        userUserInterests,
        and(
          eq(userUserInterests.userInterestId, userInterests.id),
          eq(userUserInterests.userId, userId)
        )
      );

    // mutable array of interests we want to add
    const mutableInterestNames: string[] = [...interestNames];
    const interestsToAdd: UserInterest[] = [];
    const interestsToRemove: UserInterest[] = [];
    const userInterestIdsToRemove: string[] = [];
    const interestIdsToAdd: string[] = [];
    const currentInterests: UserInterest[] = []; // To track current interests

    for (const interest of allInterests) {
      // for each db interest see if it is in array
      const indexInMutableArray = mutableInterestNames.indexOf(interest.user_interests.name);

      // if db record not in those we want to add
      if (indexInMutableArray === -1) {
        // but has a record for our user
        const userUserInterestId = interest.user_user_interests?.id;
        if (userUserInterestId) {
          // we want to remove that record
          userInterestIdsToRemove.push(userUserInterestId);
          // Add to interests to remove for return value
          interestsToRemove.push(interest.user_interests);
        }
        continue;
      }

      // if db record is part of those we want to add
      if (!interest.user_user_interests) {
        // we make sure we will add a record for our user
        interestIdsToAdd.push(interest.user_interests.id);
        // Add to interests to add for return value
        interestsToAdd.push(interest.user_interests);
        // This will be a current interest after sync
        currentInterests.push(interest.user_interests);
      } else {
        // Already exists and will remain - add to current interests
        currentInterests.push(interest.user_interests);
      }

      // remove it from our mutable array
      mutableInterestNames.splice(indexInMutableArray, 1);
    }

    // if still items in array of interests we want to add - that means we passed in one that isn't in db and should throw
    if (mutableInterestNames.length > 0) {
      throw new Error(`The following interests don't exist: ${mutableInterestNames.join(', ')}`);
    }

    // Remove user interests that need to be removed
    if (userInterestIdsToRemove.length > 0) {
      await tx
        .delete(userUserInterests)
        .where(inArray(userUserInterests.id, userInterestIdsToRemove));
    }

    // Add new user interests
    if (interestIdsToAdd.length > 0) {
      // Create connection records
      const valuesToInsert = interestIdsToAdd.map(interestId => ({
        userId,
        userInterestId: interestId
      }));

      await tx.insert(userUserInterests).values(valuesToInsert);
    }

    console.log(`added ${interestsToAdd.length} interests / removed ${interestsToRemove.length} interests so we have ${currentInterests} interests after the sync`);

    return currentInterests;
  }) ?? [];
};
