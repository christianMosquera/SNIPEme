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
  const friendsListRef = collection(FIREBASE_STORE, 'Friends');
  const friendsListQuery = query(friendsListRef);
  const friendMap = (await getDocs(friendsListQuery)).docs.map((doc) => {
    return { id: doc.id, friends: doc.data().friends, zipcode: null};
  });

  // Get the zipcodes of all users
  const usersRef = collection(FIREBASE_STORE, 'Users');
  const usersQuery = query(usersRef);
  await getDocs(usersQuery).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      const friendEntry = friendMap.find((user) => user.id === doc.id);
      if (friendEntry) {
        friendEntry.zipcode = doc.data().zipcode;
        friendEntry.allowedToSnipe = doc.data().isSnipingEnabled;
      }
    });
  });

  // Filter each user's friends to match the user's zipcode and opted in
  friendMap.forEach((user) => {
    user.friends = user.friends.filter((friend) => friendMap.find((user) => user.id === friend).zipcode === user.zipcode);
    user.friends = user.friends.filter((friend) => friendMap.find((user) => user.id === friend).allowedToSnipe);
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