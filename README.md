# basic-ielts-listining

Basic IELTS Listening practice app.

## Vercel Blob media

Audio and PDF files can be served from Vercel Blob without changing `tracks.js`.

For the public Blob store, set this environment variable in Vercel:

```txt
VITE_MEDIA_BASE_URL=https://3rdqnprfkrc5djuh.public.blob.vercel-storage.com
```

Audio files are served from the Blob `audio/` folder:

```txt
audio/01.mp3
audio/02.mp3
audio/47.mp3
```

The PDF is served from the Blob root:

```txt
basic-ielts-listening.pdf
```

If `VITE_MEDIA_BASE_URL` is empty, the app uses local files from `public/`.
