export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { put } = await import('@vercel/blob');
    const token = process.env.BLOB_READ_WRITE_TOKEN || '';
    const storeId = process.env.BLOB_STORE_ID || '';
    const body = JSON.stringify({ healthcheck: true, at: new Date().toISOString() });

    const result = await put('internal/blob-healthcheck.json', body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...(token ? { token } : {}),
      ...(storeId ? { storeId } : {}),
    });

    return res.status(200).json({
      ok: true,
      pathname: result.pathname,
      url: result.url,
      hasToken: Boolean(token),
      hasStoreId: Boolean(storeId),
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      name: err?.name || 'Error',
      message: err?.message || String(err),
      hasToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      hasStoreId: Boolean(process.env.BLOB_STORE_ID),
      vercel: Boolean(process.env.VERCEL),
    });
  }
}