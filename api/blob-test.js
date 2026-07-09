export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  const storeId = process.env.BLOB_STORE_ID || '';
  const body = JSON.stringify({ healthcheck: true, at: new Date().toISOString() });
  const modes = [];

  if (token) modes.push({ label: 'token-only', options: { token } });
  if (token && storeId) modes.push({ label: 'token+storeId', options: { token, storeId } });
  if (storeId) modes.push({ label: 'storeId-only', options: { storeId } });

  const failures = [];

  try {
    const { put } = await import('@vercel/blob');

    for (const mode of modes) {
      try {
        const result = await put('internal/blob-healthcheck.json', body, {
          access: 'public',
          contentType: 'application/json',
          addRandomSuffix: false,
          allowOverwrite: true,
          ...mode.options,
        });

        return res.status(200).json({
          ok: true,
          mode: mode.label,
          pathname: result.pathname,
          url: result.url,
          hasToken: Boolean(token),
          hasStoreId: Boolean(storeId),
        });
      } catch (err) {
        failures.push({
          mode: mode.label,
          error: err?.message || String(err),
        });
      }
    }

    return res.status(500).json({
      ok: false,
      message: 'All Blob write attempts failed',
      hasToken: Boolean(token),
      hasStoreId: Boolean(storeId),
      failures,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      name: err?.name || 'Error',
      message: err?.message || String(err),
      hasToken: Boolean(token),
      hasStoreId: Boolean(storeId),
      vercel: Boolean(process.env.VERCEL),
    });
  }
}