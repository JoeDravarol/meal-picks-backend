const admin = require('firebase-admin');
const config = require('../utils/config');
const serviceAccount = JSON.parse(config.FIREBASE_CREDS);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      private_key: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = admin.auth();

module.exports = { auth };
