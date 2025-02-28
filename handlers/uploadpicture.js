
import bucket from "../db/firebaseconnection.js";

// Set up Multer to handle file uploads
export const handleUploadPicture = async (req, res) => {
  console.log("Calling for upload picture!");
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const file = req.file;
    const fileName = `usersavatar/${Date.now()}-${file.originalname}`;
    console.log("============== > check point filename:" + fileName);
    const fileUpload = bucket.file(fileName);

    // Upload file to Firebase Storage
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Upload failed:", err);
      return res.status(500).json({ message: "Upload failed", error: err.message });
    });

    stream.on("finish", async () => {
      // Make the file publicly accessible
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      console.log(`Uploaded to: ${publicUrl}`);
      return res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
    });

    stream.end(file.buffer);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }

}

export default handleUploadPicture;