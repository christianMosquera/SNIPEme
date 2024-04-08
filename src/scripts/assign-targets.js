const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs, query, writeBatch } = require('firebase/firestore');

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
    return { id: doc.id, friends: doc.data().friends, deviceToken: null, allowedToSnipe: null, zipcode: null, target: null};
  });

  // Get the zipcodes of all users
  const usersRef = collection(FIREBASE_STORE, 'Users');
  const usersQuery = query(usersRef);
  await getDocs(usersQuery).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      const friendEntry = friendMap.find((user) => user.id === doc.id);
      if (friendEntry) {
        friendEntry.deviceToken = doc.data().device_token;
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
      batch.set(targetRef, { target_id: null }, { merge: true });
      user.target = null;
    } else {
      // Otherwise, assign a random target
      const target = user.friends[Math.floor(Math.random() * friendCount)];
      batch.set(targetRef, { target_id: target }, { merge: true });
      user.target = target;
    }
  }

  await batch.commit();

  // Send a notification to every user
  for (let i = 0; i < friendMap.length; i++) {
    const user = friendMap[i];
    const deviceToken = user.deviceToken;
    if (!deviceToken || !user.target) continue;

    const targetRef = doc(FIREBASE_STORE, "Users", user.target);
    const target = (await getDoc(targetRef)).data().username;

    // Prepare the notification
    const key = 'AAAAKdWzAgE:APA91bGlOTp7xoTGh4U-WrrOgtsbrJ2Qpq-y_Cw_izt1OoKUseBObRr3HlB7y7Opbomtqp03EHcvPJVn5wc-3byOveFL9wWCR_jXIiBKlA1Ud8YigzZ9y_RAA2URFl_81YNt92lka5I-';
    const notification = {
      title: 'New Targets Assigned!',
      body: target ? `Your target for today is ${target}!` : 'You have no target today.'
    };

    // Send the notification
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: 'key=' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notification: notification,
        to: deviceToken,
      }),
    })
    .then((response) => {
      console.log("Got response", response.status, "when sending notification to", user.id);
    })
    .catch((error) => {
      console.error("Error sending notification: ", error);
    });
  }
}

main()
.catch(error => console.log(error))
.finally(() => {
  process.exit(0);
});