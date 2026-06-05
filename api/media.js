const PRIVATE_BLOB_HOST_SUFFIX = '.private.blob.vercel-storage.com';

function getPrivateBlobHost() {
  const storeId = process.env.BLOB_STORE_ID;
  if (storeId) {
    return `${storeId.replace(/^store_/, '')}${PRIVATE_BLOB_HOST_SUFFIX}`;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const match = token.match(/^vercel_blob_rw_([^_]+)_/);
  if (match) {
    return `${match[1]}${PRIVATE_BLOB_HOST_SUFFIX}`;
  }

  return null;
}

function encodePathname(pathname) {
  return pathname
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export default async function handler(request, response) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const host = getPrivateBlobHost();
  const pathname = request.query.pathname;

  if (!token || !host) {
    return response.status(500).json({ error: 'Blob credentials are not configured.' });
  }

  if (!pathname || Array.isArray(pathname) || pathname.includes('..')) {
    return response.status(400).json({ error: 'Invalid pathname.' });
  }

  const blobUrl = `https://${host}/${encodePathname(pathname)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (request.headers.range) {
    headers.Range = request.headers.range;
  }

  const blobResponse = await fetch(blobUrl, { headers });

  if (!blobResponse.ok && blobResponse.status !== 206 && blobResponse.status !== 304) {
    return response.status(blobResponse.status).send(blobResponse.statusText || 'Blob request failed');
  }

  for (const headerName of [
    'content-type',
    'content-length',
    'content-range',
    'accept-ranges',
    'etag',
    'last-modified',
  ]) {
    const value = blobResponse.headers.get(headerName);
    if (value) {
      response.setHeader(headerName, value);
    }
  }

  response.setHeader('Cache-Control', 'private, no-cache');
  response.status(blobResponse.status);

  if (!blobResponse.body) {
    return response.end();
  }

  const reader = blobResponse.body.getReader();

  async function writeChunk() {
    const { done, value } = await reader.read();
    if (done) {
      response.end();
      return;
    }
    response.write(Buffer.from(value));
    await writeChunk();
  }

  return writeChunk();
}
