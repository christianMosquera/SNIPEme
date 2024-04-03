const { initializeApp } = require('firebase/app');
const { getFirestore, doc, collection, getDocs, query, writeBatch } = require('firebase/firestore');

const main = async () => {
  // Initialize Firebase Access
  const firebaseConfig = {
    apiKey: 'AIzaSyC4GUIMgdgrzI3SSPimwKys-HHwbqJyVtA',
    authDomain: 'snipeme-22003.firebaseapp.com',
    projectId: 'snipeme-22003',
    storageBucket: 'snipeme-22003.appspot.com',
    messagingSenderId: '179678937601',
    appId: '1:179678937601:web:06ccecaf08bf19eeaf3600',
    measurementId: 'G-SK5H80GWXT',
  };
  const FIREBASE_APP = initializeApp(firebaseConfig);
  const FIREBASE_STORE = getFirestore(FIREBASE_APP);

  // Get a list of all users and their friends
  const usersRef = collection(FIREBASE_STORE, 'Friends');
  const usersQuery = query(usersRef);
  const friendMap = (await getDocs(usersQuery)).docs.map((doc) => {
    return { id: doc.id, friends: doc.data().friends};
  });

  // Assign targets to each user
  const batch = writeBatch(FIREBASE_STORE);
  for (let i = 0; i < friendMap.length; i++) {
    const user = friendMap[i];
    const friendCount = user.friends.length;
    const targetRef = doc(FIREBASE_STORE, "Targets", user.id);
    
    if (friendCount === 0) {
      // If they have no friends, they get no target
      batch.set(targetRef, { target_id: "" }, { merge: true });
    } else {
      // Otherwise, assign a random target
      const target = user.friends[Math.floor(Math.random() * friendCount)];
      batch.set(targetRef, { target_id: target }, { merge: true });
    }
  }

  await batch.commit();
}

main()
.catch(error => console.log(error))
.finally(() => {
  process.exit(0);
});