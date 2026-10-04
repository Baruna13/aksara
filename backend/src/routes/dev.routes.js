import { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

router.get('/google', (_req, res) => res.sendFile(path.join(dir, '../dev/google-test.html')));
router.get('/config', (_req, res) => res.json({ googleClientId: env.GOOGLE_CLIENT_IDS[0] || null }));

export default router;
