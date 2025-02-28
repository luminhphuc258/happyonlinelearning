import admin from "firebase-admin";
import { readFile } from "fs/promises";
import { getStorage } from "firebase-admin/storage";

// Load Firebase Service Account JSON asynchronously
const serviceAccount = JSON.parse(
  await readFile(new URL("../happyonlinelearning-firebase-adminsdk-fbsvc-627f7470e8.json", import.meta.url))
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "happyonlinelearning.firebasestorage.app",
});

const bucket = getStorage().bucket();
export default bucket;

