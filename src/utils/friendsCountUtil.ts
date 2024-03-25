// friendsCountUtils.ts
import {doc, runTransaction, Firestore} from 'firebase/firestore';
import {FIREBASE_STORE} from '../../firebase';

export const modifyFriendsCount = async (
  userId: string,
  change: number,
): Promise<void> => {
  console.log(
    `modifyFriendsCount called for userId=${userId} with change=${change}`,
  );

  const userRef = doc(FIREBASE_STORE, 'Users', userId);

  try {
    await runTransaction(FIREBASE_STORE as Firestore, async transaction => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        console.error(`Document for userId=${userId} does not exist.`);
        throw new Error(`Document for userId=${userId} does not exist.`);
      }

      const currentCount = userDoc.data().friendsCount || 0;
      const newCount = currentCount + change;

      if (newCount < 0) {
        console.log(
          `Cannot decrement friendsCount for userId=${userId} below 0.`,
        );
        return;
      }

      transaction.update(userRef, {friendsCount: newCount});
      console.log(`Successfully modified friends count by ${change}`);
    });
  } catch (error) {
    console.error(
      `Error modifying friends count for userId=${userId} by ${change}:`,
      error,
    );

    throw new Error(
      `Error modifying friends count: ${
        error instanceof Error ? error.message : ''
      }`,
    );
  }
};
