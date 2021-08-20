const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

module.exports = { auth };
