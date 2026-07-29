const API_ROUTES = {
  '/api/log': () => import('./api/log.js'),
  '/api/stats': () => import('./api/stats.js'),
  '/api/webhook': () => import('./api/webhook.js'),
  '/api/blob-test': () => import('./api/blob-test.js'),
  '/api/generate-questions': () => import('./api/generate-questions.js'),
};

// Routes that must always run the real handler in dev (never the Telegram stub),
// because they depend on their own env (OpenAI / Supabase), not Telegram.
const ALWAYS_REAL_ROUTES = new Set(['/api/generate-questions']);

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      resolve(undefined);
      return;
    }

    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function createVercelResponse(res) {
  let statusCode = 200;
  const api = {
    setHeader(name, value) {
      res.setHeader(name, value);
      return api;
    },
    status(code) {
      statusCode = code;
      return api;
    },
    json(data) {
      res.statusCode = statusCode;
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      res.end(JSON.stringify(data));
    },
    end(data) {
      res.statusCode = statusCode;
      res.end(data);
    },
  };
  return api;
}

function hasTelegramConfig(env) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  return Boolean(token && chatId);
}

function devStubResponse(urlPath, body) {
  if (urlPath === '/api/log') {
    const allowedTypes = new Set(['session_start', 'track_play', 'note_save', 'dictation_save']);
    if (!body?.type || !allowedTypes.has(body.type) || !body?.deviceId) {
      return { error: 'Invalid payload' };
    }
    return { success: true, nickname: body.nickname || null };
  }
  if (urlPath === '/api/stats') {
    return {
      totalUnique: 0,
      totalVisits: 0,
      dailyActive: 0,
      weeklyActive: 0,
      monthlyActive: 0,
      deviceTypes: {},
    };
  }
  if (urlPath === '/api/webhook') {
    return { ok: true };
  }
  return { ok: true };
}

export function vercelApiDevPlugin(env = {}) {
  Object.assign(process.env, env);

  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = (req.url || '').split('?')[0];
        const loader = API_ROUTES[urlPath];
        if (!loader) return next();

        try {
          const body = await readJsonBody(req);

          if (!hasTelegramConfig(env) && !ALWAYS_REAL_ROUTES.has(urlPath)) {
            const vercelRes = createVercelResponse(res);
            vercelRes.status(200).json(devStubResponse(urlPath, body));
            return;
          }

          req.body = body;
          const handlerModule = await loader();
          const handler = handlerModule.default;
          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.end('API handler missing');
            return;
          }

          const vercelRes = createVercelResponse(res);
          await handler(req, vercelRes);
        } catch (err) {
          console.error(`[vercel-api-dev] ${urlPath}:`, err);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Dev API error', details: err.message }));
          }
        }
      });
    },
  };
}