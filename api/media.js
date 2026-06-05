import { Readable } from 'node:stream';

const PRIVATE_BLOB_HOST_SUFFIX = '.private.blob.vercel-storage.com';

function getPrivateBlobHost() {
  const storeId = process.env.BLOB_STORE_ID;
  if (storeId) {
    return `${storeId.replace(/^store_/, '')}${PRIVATE_BLOB_HOST_SUFFIX}`;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const match = token.match(/^vercel_blob_rw_([^_]+)_/);
  return match ? `${match[1]}${PRIVATE_BLOB_HOST_SUFFIX}` : null;
}

function isSafePathname(pathname) {
  return (
    typeof pathname === 'string' &&
    pathname.length > 0 &&
    !pathname.startsWith('/') &&
    !pathname.includes('..') &&
    !pathname.includes('\\')
  );
}

function encodePathname(pathname) {
  return pathname
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function getCandidatePathnames(pathname) {
  const candidates = [pathname];

  if (!pathname.startsWith('public/')) {
    candidates.push(`public/${pathname}`);
  }

  if (!pathname.startsWith('basic-ielts-listining-blob/')) {
    candidates.push(`basic-ielts-listining-blob/${pathname}`);
  }

  if (pathname.endsWith('.mp3')) {
    const filename = pathname.split('/').pop();
    candidates.push(`basic-ielts-listining-blob/audio/${filename}`);
    candidates.push(`audio/${filename}`);
  }

  if (pathname.endsWith('.pdf')) {
    const filename = pathname.split('/').pop();
    candidates.push(`basic-ielts-listining-blob/${filename}`);
  }

  return [...new Set(candidates)];
}

export default async function handler(request, response) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const host = getPrivateBlobHost();
  const { pathname } = request.query;
  const debug = request.query.debug === '1';

  if (!token || !host) {
    return response.status(500).json({ error: 'Blob credentials are not configured.' });
  }

  if (!isSafePathname(pathname)) {
    return response.status(400).json({ error: 'Invalid pathname.' });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  for (const [incoming, outgoing] of [
    ['range', 'Range'],
    ['if-none-match', 'If-None-Match'],
    ['if-modified-since', 'If-Modified-Since'],
  ]) {
    if (request.headers[incoming]) {
      headers[outgoing] = request.headers[incoming];
    }
  }

  const method = request.method === 'HEAD' ? 'HEAD' : 'GET';
  const candidatePathnames = getCandidatePathnames(pathname);

  let blobResponse;
  const attempts = [];

  for (const candidatePathname of candidatePathnames) {
    const blobUrl = `https://${host}/${encodePathname(candidatePathname)}`;
    blobResponse = await fetch(blobUrl, { method, headers });
    attempts.push({
      pathname: candidatePathname,
      status: blobResponse.status,
      statusText: blobResponse.statusText,
    });

    if (blobResponse.ok || blobResponse.status === 206 || blobResponse.status === 304) {
      break;
    }
  }

  response.status(blobResponse.status);

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

  if (!blobResponse.ok && blobResponse.status !== 206 && blobResponse.status !== 304) {
    if (debug) {
      return response.json({
        error: 'Blob file was not found with the attempted pathnames.',
        host,
        attempts,
      });
    }
    return response.send(blobResponse.statusText || 'Blob request failed');
  }

  if (request.method === 'HEAD' || !blobResponse.body) {
    return response.end();
  }

  return Readable.fromWeb(blobResponse.body).pipe(response);
}
