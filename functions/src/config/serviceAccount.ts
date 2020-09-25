import * as admin from 'firebase-admin';
const serviceAccount = require("../../Retrogames-fec204340184.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://retrogames-be713.firebaseio.com"
});

export default app;