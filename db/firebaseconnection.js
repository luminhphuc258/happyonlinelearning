const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(require('../happyonlinelearning-firebase-adminsdk-fbsvc-627f7470e8.json')),
  storageBucket: 'happyonlinelearning.appspot.com',
});

const bucket = admin.storage().bucket();

async function uploadAvatar(localFilePath, userName) {
  const destination = `usersavatar/${userName}-${Date.now()}.png`;

  try {
    const [uploadedFile] = await bucket.upload(localFilePath, {
      destination,
      public: true,
    });

    //gs://happyonlinelearning.firebasestorage.app/usersavatar
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uploadedFile.name}`;
    console.log(`Uploaded to: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error('Upload failed:', err);
  }
}

// Example usage:
//uploadAvatar(path.join(__dirname, 'avatar.png'), 'john_doe');
