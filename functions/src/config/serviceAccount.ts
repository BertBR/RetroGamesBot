import * as admin from 'firebase-admin';
const serviceAccount = require("../../../retrogames-be713-firebase-adminsdk-cnm07-a14e8f17f5.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://retrogames-be713.firebaseio.com"
});

export default app;