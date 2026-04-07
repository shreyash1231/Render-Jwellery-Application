const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file) {
  try {
    const buffer = file.buffer;

    const originalName = file.originalname;
    const fileExtension = originalName.split(".").pop()?.toLowerCase();

    const fileName = `uploads/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${fileExtension}`;

    const bucketName = process.env.AWS_S3_BUCKET;

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = fileName;

    return fileUrl;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("File upload failed");
  }
}

module.exports = { uploadFileToS3 };
