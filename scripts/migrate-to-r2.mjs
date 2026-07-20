// One-off migration: copy media from the public Vercel Blob store to Cloudflare R2.
// Run with: node --env-file=.env scripts/migrate-to-r2.mjs
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { TRACKS } from '../tracks.js';

const BLOB_BASE_URL = 'https://3rdqnprfkrc5djuh.public.blob.vercel-storage.com';

const FOLDER_BY_BOOK = {
  'basic-ielts': 'audio',
  'listening-strategies': 'audio-strategies',
  dracula: 'audio-books',
};

const PDF_BY_BOOK = {
  'basic-ielts': { file: 'basic-ielts-listening.pdf', folder: 'audio' },
  'listening-strategies': {
    file: 'Listening Strategies for the IELTS Test.pdf',
    folder: 'audio-strategies',
  },
};

function buildManifest() {
  const items = [];
  for (const track of TRACKS) {
    const folder = FOLDER_BY_BOOK[track.bookId];
    if (!folder) continue;
    items.push({ key: `${folder}/${track.filename}`, folder, filename: track.filename });
  }
  for (const { file, folder } of Object.values(PDF_BY_BOOK)) {
    items.push({ key: `${folder}/${file}`, folder, filename: file });
  }
  // de-dupe (PDF/track filenames shouldn't collide, but be safe)
  const seen = new Set();
  return items.filter((i) => (seen.has(i.key) ? false : (seen.add(i.key), true)));
}

function contentTypeFor(filename) {
  if (filename.endsWith('.mp3')) return 'audio/mpeg';
  if (filename.endsWith('.pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

async function main() {
  const required = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_ENDPOINT',
    'R2_BUCKET',
  ];
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  const manifest = buildManifest();
  console.log(`Found ${manifest.length} objects to migrate.\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [i, item] of manifest.entries()) {
    const label = `[${i + 1}/${manifest.length}] ${item.key}`;
    try {
      await s3.send(
        new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: item.key })
      );
      console.log(`${label} — already in R2, skipping`);
      skipped++;
      continue;
    } catch {
      // not found, proceed to upload
    }

    const sourceUrl = `${BLOB_BASE_URL}/${item.folder}/${encodeURIComponent(item.filename)}`;
    try {
      const res = await fetch(sourceUrl);
      if (!res.ok) throw new Error(`fetch ${res.status} ${res.statusText}`);
      const body = Buffer.from(await res.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: item.key,
          Body: body,
          ContentType: contentTypeFor(item.filename),
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );
      console.log(`${label} — uploaded (${(body.length / 1024 / 1024).toFixed(2)} MB)`);
      uploaded++;
    } catch (err) {
      console.error(`${label} — FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Uploaded: ${uploaded}, skipped (already present): ${skipped}, failed: ${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
