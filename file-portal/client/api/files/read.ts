import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import path from 'path';
import { lookup as lookupMime } from 'mime-types';
import { setCorsHeaders, handleOptions } from '../_lib/cors.js';
import { authenticateRequest } from '../_lib/auth.js';
import { readFileBuffer } from '../_lib/sftp.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return handleOptions(res);
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  try {
    const requestedPath = (req.query.path as string) || '';
    const buffer = await readFileBuffer(requestedPath);
    const mimeType = (lookupMime(requestedPath) || 'application/octet-stream') as string;
    const isText = mimeType.startsWith('text/') || mimeType === 'application/json' || mimeType.includes('xml');
    const content = isText ? buffer.toString('utf-8') : buffer.toString('base64');
    const checksum = crypto.createHash('md5').update(buffer).digest('hex');

    return res.status(200).json({
      success: true,
      file: {
        path: requestedPath,
        name: path.basename(requestedPath),
        content,
        encoding: isText ? 'utf-8' : 'base64',
        isBinary: !isText,
        mimeType,
        size: buffer.byteLength,
        modified: new Date().toISOString(),
        checksum,
      },
    });
  } catch (error: any) {
    if (error.message === 'INVALID_PATH') {
      return res.status(403).json({
        success: false,
        error: { code: 'INVALID_PATH', message: 'Invalid path' },
      });
    }
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
}
