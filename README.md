# basic-ielts-listining

Basic IELTS Listening practice app.

## Vercel Blob media

Audio and PDF files can be served from Vercel Blob without changing `tracks.js`.

For a private Blob store, set these environment variables in Vercel:

```txt
VITE_MEDIA_PROXY_PATH=/api/media
BLOB_PRIVATE_BASE_URL=https://fujtbsiuzitsemue.private.blob.vercel-storage.com
BLOB_STORE_ID=store_yourStoreId
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_yourStoreId_secret
```

Keep the uploaded Blob paths the same as the old `public/` paths:

```txt
basic-ielts-listening.pdf
basic-ielts-listening1/01.mp3
basic-ielts-listening2/47.mp3
basic-ielts-listening3/77.mp3
```

The browser requests media through `/api/media?pathname=...`; the token stays on the Vercel server and is never exposed to frontend code. Audio files are read from `basic-ielts-listining-blob/audio/01.mp3`, `02.mp3`, and so on.

For a public Blob store, use this instead:

```txt
VITE_MEDIA_BASE_URL=https://your-store-id.public.blob.vercel-storage.com
```

If both `VITE_MEDIA_PROXY_PATH` and `VITE_MEDIA_BASE_URL` are empty, the app uses local files from `public/`.
