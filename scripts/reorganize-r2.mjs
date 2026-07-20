// Flattens the already-uploaded R2 objects into the folder layout app.js expects:
//   audio/<filename>            (basic-ielts book)
//   audio-strategies/<filename> (listening-strategies book)
import {
  S3Client,
  ListObjectsV2Command,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const Bucket = process.env.R2_BUCKET;

async function listAll() {
  let token;
  const keys = [];
  do {
    const res = await s3.send(new ListObjectsV2Command({ Bucket, ContinuationToken: token }));
    for (const obj of res.Contents || []) keys.push(obj.Key);
    token = res.NextContinuationToken;
  } while (token);
  return keys;
}

function contentTypeFor(filename) {
  if (filename.endsWith('.mp3')) return 'audio/mpeg';
  if (filename.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

function encodeCopySource(key) {
  return key.split('/').map(encodeURIComponent).join('/');
}

async function main() {
  const keys = await listAll();
  const moves = [];

  for (const key of keys) {
    const basename = key.split('/').pop();
    if (key.startsWith('BASIC IELTS Listening/') && basename.endsWith('.mp3')) {
      moves.push({ from: key, to: `audio/${basename}` });
    } else if (key === 'BASIC IELTS Listening/basic-ielts-listening.pdf') {
      moves.push({ from: key, to: 'audio/basic-ielts-listening.pdf' });
    } else if (key.startsWith('stragtegies/Audio/') && basename.endsWith('.mp3')) {
      moves.push({ from: key, to: `audio-strategies/${basename}` });
    } else if (key === 'stragtegies/Listening Strategies for the IELTS Test.pdf') {
      moves.push({ from: key, to: 'audio-strategies/Listening Strategies for the IELTS Test.pdf' });
    }
    // everything else (Destination-B1.pdf, answer key.pdf) is left untouched — unused by the app
  }

  console.log(`Planned moves: ${moves.length}\n`);

  let done = 0;
  let failed = 0;
  for (const [i, m] of moves.entries()) {
    const label = `[${i + 1}/${moves.length}] ${m.from} -> ${m.to}`;
    try {
      await s3.send(
        new CopyObjectCommand({
          Bucket,
          Key: m.to,
          CopySource: `${Bucket}/${encodeCopySource(m.from)}`,
          MetadataDirective: 'REPLACE',
          ContentType: contentTypeFor(m.to),
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );
      await s3.send(new DeleteObjectCommand({ Bucket, Key: m.from }));
      console.log(`${label} — ok`);
      done++;
    } catch (err) {
      console.error(`${label} — FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Moved: ${done}, failed: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
