const {
  setDoc,
  doc,
  getDocs,
  query,
  collection,
  where,
  Timestamp,
  initializeFirestore,
} = require('firebase/firestore');
const {initializeApp} = require('firebase/app');

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC4GUIMgdgrzI3SSPimwKys-HHwbqJyVtA',
  authDomain: 'snipeme-22003.firebaseapp.com',
  projectId: 'snipeme-22003',
  storageBucket: 'snipeme-22003.appspot.com',
  messagingSenderId: '179678937601',
  appId: '1:179678937601:web:06ccecaf08bf19eeaf3600',
  measurementId: 'G-SK5H80GWXT',
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_STORE = initializeFirestore(FIREBASE_APP, {
  experimentalForceLongPolling: true, // this can be removed if not needed
});

const sniperId = 'cnd1cFNtEnSlGLLeNDhoOaWP8P92';
const targets = ['q2b3gInSZiMQ4ZiPciCo7biy9QX2'];

async function generatePosts(numPosts, startDate) {
  let postDate = new Date(startDate);
  let attempts = 0;
  let postsCreated = 0;

  while (postsCreated < numPosts && attempts < numPosts * 2) {
    attempts++;
    const formattedDate = formatDate(postDate);

    const sniperHasPosted = await hasPosted(sniperId, postDate);
    const targetHasPosted = await hasPosted(
      targets[postsCreated % targets.length],
      postDate,
    );

    console.log(`Checking for posts on date: ${formattedDate}`);

    if (sniperHasPosted) {
      console.log(`Sniper has already posted on ${formattedDate}.`);
    }

    if (targetHasPosted) {
      console.log(`Target has already been sniped on ${formattedDate}.`);
    }

    if (sniperHasPosted || targetHasPosted) {
      console.log(
        `Skipping date ${formattedDate} as sniper or target has already posted.`,
      );
    } else {
      console.log(`Attempting to add post for date: ${formattedDate}`);
      try {
        const imagePath = `gs://snipeme-22003.appspot.com/snipes/${sniperId}/${formattedDate}.jpg`;
        const snipeData = createSnipeData(
          sniperId,
          targets[postsCreated % targets.length],
          imagePath,
          postDate,
        );

        const snipeRef = doc(
          FIREBASE_STORE,
          'Posts',
          `${sniperId}${formattedDate}`,
        );
        await setDoc(snipeRef, snipeData);
        console.log(`Post added to database for date: ${formattedDate}`);
        postsCreated++;
      } catch (error) {
        console.error(`Failed to add post for date ${formattedDate}: ${error}`);
      }
    }

    // Only go back one day if a post could not be created for the current postDate
    postDate.setDate(postDate.getDate() - 1);
  }
}

// Utility functions
function formatDate(date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

function createSnipeData(sniperId, targetId, imagePath, date) {
  return {
    approved: true,
    sniper_id: sniperId,
    target_id: targetId,
    image: imagePath,
    timestamp: Timestamp.fromDate(date),
  };
}

async function hasPosted(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  console.log(
    `Checking if user ${userId} has posted between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}.`,
  );

  const postsQuery = query(
    collection(FIREBASE_STORE, 'Posts'),
    where(userId === sniperId ? 'sniper_id' : 'target_id', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
    where('timestamp', '<=', Timestamp.fromDate(endOfDay)),
  );

  const querySnapshot = await getDocs(postsQuery);
  console.log(
    `User ${userId} posted on date ${formatDate(
      date,
    )}: ${!querySnapshot.empty}`,
  );
  return !querySnapshot.empty;
}

const startDate = new Date('2024-01-17');
generatePosts(2, startDate).catch(error => console.error(error));
