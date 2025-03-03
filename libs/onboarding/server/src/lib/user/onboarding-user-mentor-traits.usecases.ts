import { db } from '~db/client';
import { and, eq, inArray } from 'drizzle-orm';
import { UserMentorTrait, userMentorTraits, userUserMentorTraits } from '~db/schema/user-mentor-traits';

export type SyncUserMentorTraitsCommand = {
  userId: string;
  traitNames: string[];
};

/**
 * Syncs a user's mentor traits with the provided list of trait names.
 * - Validates all traits exist in the database
 * - Creates new connections for traits not already connected to the user
 * - Removes connections for traits not in the provided list
 * - Returns the current set of traits after sync operations
 *
 * @param command Object containing userId and array of trait names
 * @returns Object containing arrays of created, removed, and current user-trait connections
 * @throws Error if any of the provided traits don't exist in the database
 */
export const syncUserMentorTraitsUsecase = async ({
                                                    userId,
                                                    traitNames
                                                  }: SyncUserMentorTraitsCommand): Promise<UserMentorTrait[]> => {
  // Validate inputs
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!Array.isArray(traitNames)) {
    throw new Error('Trait names must be an array');
  }

  // Empty array is allowed - it will clear all user mentor traits

  // Use a transaction to ensure data integrity
  return await db.transaction(async (tx) => {
    // 1. Fetch all mentor traits from the database
    // Left join with the user's active traits to get their current status
    const allTraits = await tx
      .select()
      .from(userMentorTraits)
      .leftJoin(
        userUserMentorTraits,
        and(
          eq(userUserMentorTraits.userMentorTraitId, userMentorTraits.id),
          eq(userUserMentorTraits.userId, userId)
        )
      );

    // mutable array of traits we want to add
    const mutableTraitNames: string[] = [...traitNames];
    const traitsToAdd: UserMentorTrait[] = [];
    const traitsToRemove: UserMentorTrait[] = [];
    const userTraitIdsToRemove: string[] = [];
    const traitIdsToAdd: string[] = [];
    const currentTraits: UserMentorTrait[] = []; // To track current traits

    for (const trait of allTraits) {
      // for each db trait see if it is in array
      const indexInMutableArray = mutableTraitNames.indexOf(trait.user_mentor_traits.name);

      // if db record not in those we want to add
      if (indexInMutableArray === -1) {
        // but has a record for our user
        const userUserTraitId = trait.user_user_mentor_traits?.id;
        if (userUserTraitId) {
          // we want to remove that record
          userTraitIdsToRemove.push(userUserTraitId);
          // Add to traits to remove for return value
          traitsToRemove.push(trait.user_mentor_traits);
        }
        continue;
      }

      // if db record is part of those we want to add
      if (!trait.user_user_mentor_traits) {
        // we make sure we will add a record for our user
        traitIdsToAdd.push(trait.user_mentor_traits.id);
        // Add to traits to add for return value
        traitsToAdd.push(trait.user_mentor_traits);
        // This will be a current trait after sync
        currentTraits.push(trait.user_mentor_traits);
      } else {
        // Already exists and will remain - add to current traits
        currentTraits.push(trait.user_mentor_traits);
      }

      // remove it from our mutable array
      mutableTraitNames.splice(indexInMutableArray, 1);
    }

    // if still items in array of traits we want to add - that means we passed in one that isn't in db and should throw
    if (mutableTraitNames.length > 0) {
      throw new Error(`The following traits don't exist: ${mutableTraitNames.join(', ')}`);
    }

    // Remove user traits that need to be removed
    if (userTraitIdsToRemove.length > 0) {
      await tx
        .delete(userUserMentorTraits)
        .where(inArray(userUserMentorTraits.id, userTraitIdsToRemove));
    }

    // Add new user traits
    if (traitIdsToAdd.length > 0) {
      // Create connection records
      const valuesToInsert = traitIdsToAdd.map(traitId => ({
        userId,
        userMentorTraitId: traitId
      }));

      await tx.insert(userUserMentorTraits).values(valuesToInsert);
    }

    console.log(`added ${traitIdsToAdd.length} traits / removed ${traitsToRemove.length} traits so we have ${currentTraits} traits after the sync`)

    return currentTraits
  }) ?? [];
};
