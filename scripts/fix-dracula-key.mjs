import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const Bucket = process.env.R2_BUCKET;
const from = 'audio-book/Dracula - Bram Stoker.mp3';
const to = 'audio-books/Dracula - Bram Stoker.mp3';

await s3.send(
  new CopyObjectCommand({
    Bucket,
    Key: to,
    CopySource: `${Bucket}/${from.split('/').map(encodeURIComponent).join('/')}`,
    MetadataDirective: 'REPLACE',
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  })
);
await s3.send(new DeleteObjectCommand({ Bucket, Key: from }));
console.log(`Moved: ${from} -> ${to}`);
