export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const storeId = process.env.BLOB_STORE_ID || '';
  const oidc = Boolean(process.env.VERCEL_OIDC_TOKEN);
  const body = JSON.stringify({ healthcheck: true, at: new Date().toISOString() });

  if (!storeId && !token && !process.env.VERCEL) {
    return res.status(500).json({
      ok: false,
      message: 'No Blob credentials: connect store to project or set BLOB_READ_WRITE_TOKEN',
    });
  }

  try {
    const { put } = await import('@vercel/blob');
    const blobOptions = process.env.VERCEL && storeId
      ? {}
      : (token ? { token } : {});

    const result = await put('internal/blob-healthcheck.json', body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobOptions,
    });

    return res.status(200).json({
      ok: true,
      auth: process.env.VERCEL && storeId ? 'oidc' : 'token',
      storeId: storeId ? 'set' : 'missing',
      oidc,
      hasLegacyToken: Boolean(token),
      pathname: result.pathname,
      url: result.url,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err?.message || String(err),
      auth: process.env.VERCEL && storeId ? 'oidc' : 'token',
      storeId: storeId ? 'set' : 'missing',
      oidc,
      hasLegacyToken: Boolean(token),
      hint: storeId && token
        ? 'Remove stale BLOB_READ_WRITE_TOKEN from Vercel env — OIDC (BLOB_STORE_ID) should be used.'
        : 'Connect Blob store to the fluentear project, then redeploy.',
    });
  }
}