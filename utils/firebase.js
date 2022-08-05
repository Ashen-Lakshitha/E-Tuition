var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tutorlk-bff00-default-rtdb.firebaseio.com"
});

module.exports.admin = admin