import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

let token;
let total = 0;
const keys = [];
do {
  const res = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET,
      ContinuationToken: token,
    })
  );
  for (const obj of res.Contents || []) {
    keys.push({ key: obj.Key, size: obj.Size });
    total++;
  }
  token = res.NextContinuationToken;
} while (token);

console.log(`Total objects: ${total}\n`);
for (const k of keys) {
  console.log(`${(k.size / 1024 / 1024).toFixed(2)} MB  ${k.key}`);
}
