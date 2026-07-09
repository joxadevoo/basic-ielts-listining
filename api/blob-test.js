export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const body = JSON.stringify({ healthcheck: true, at: new Date().toISOString() });

  if (!token) {
    return res.status(500).json({
      ok: false,
      message: 'BLOB_READ_WRITE_TOKEN is missing on this Vercel project',
    });
  }

  try {
    const { put } = await import('@vercel/blob');
    const result = await put('internal/blob-healthcheck.json', body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token,
    });

    return res.status(200).json({
      ok: true,
      pathname: result.pathname,
      url: result.url,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err?.message || String(err),
      hint: 'Reconnect Blob store to the fluentear project in Vercel Storage, then redeploy.',
    });
  }
}