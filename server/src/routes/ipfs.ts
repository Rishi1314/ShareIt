import express from 'express';
import multer from 'multer';
import { authenticateJWT } from '../middleware/authenticate';
import { PrismaClient } from '@prisma/client';
import redis from '../utils/redis';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// ---- Cache settings ----
const CACHE_TTL_SECONDS = 600;       // 10 minutes
const MAX_CACHE_ITEMS   = 200;       // keep newest N files

const cacheKeyFor = (userId: string) => `files:user:${userId}`;

// ---- Timer helpers ----
const safeTime = new Map<string, boolean>();
function startTimer(label: string) {
  if (!safeTime.get(label)) {
    safeTime.set(label, true);
    console.time(label);
  }
}
function endTimer(label: string) {
  if (safeTime.get(label)) {
    console.timeEnd(label);
    safeTime.set(label, false);
  }
}

// ========= Upload to IPFS =========
router.post('/ipfs', authenticateJWT, upload.none(), async (req, res) => {
  startTimer('⏱️ Total Upload');

  try {
    const { alias, password, ipfsResponse } = req.body;
    const userId = (req as any).user?.id as string;

    if (!alias || !ipfsResponse || !userId) {
      return res.status(400).json({ error: 'Alias, IPFS response, and user ID are required.' });
    }

    // Parse IPFS response
    startTimer('⏱️ Parse IPFS');
    const parsed = JSON.parse(ipfsResponse);
    endTimer('⏱️ Parse IPFS');

    // Duplicate alias check
    startTimer('⏱️ Check Alias');
    const existingFile = await prisma.file.findFirst({
      where: { alias, uploadedBy: userId },
      select: { id: true },
    });
    endTimer('⏱️ Check Alias');

    if (existingFile) {
      return res.status(409).json({ error: `Alias "${alias}" already exists.` });
    }

    // Duplicate CID check
    startTimer('⏱️ Check CID');
    const cidCheck = await prisma.file.findFirst({
      where: { cid: parsed.IpfsHash, uploadedBy: userId },
      select: { id: true },
    });
    endTimer('⏱️ Check CID');

    if (cidCheck) {
      return res.status(409).json({ error: 'File with same CID already exists.' });
    }

    // Create DB record
    startTimer('⏱️ Create Record');
    const newFile = await prisma.file.create({
      data: {
        alias: alias.trim(),
        password: password?.trim() || null,
        cid: parsed.IpfsHash,
        pinataId: parsed.ID,
        pinSize: parsed.PinSize,
        timestamp: new Date(parsed.Timestamp),
        fileName: parsed.Name,
        mimeType: parsed.MimeType,
        numberOfFiles: parsed.NumberOfFiles,
        isDuplicate: parsed.isDuplicate ?? false,
        uploadedBy: userId,
        url: `https://gateway.pinata.cloud/ipfs/${parsed.IpfsHash}`,
      },
      select: {
        id: true,
        alias: true,
        cid: true,
        fileName: true,
        mimeType: true,
        pinSize: true,
        createdAt: true,
      },
    });
    endTimer('⏱️ Create Record');

    // ✅ Atomic cache update: LPUSH (newest first) + LTRIM + EXPIRE
    const key = cacheKeyFor(userId);
    await redis
      .multi()
      .lpush(key, JSON.stringify(newFile))
      .ltrim(key, 0, MAX_CACHE_ITEMS - 1)
      .expire(key, CACHE_TTL_SECONDS)
      .exec();

    endTimer('⏱️ Total Upload');
    return res.status(201).json({ message: '✅ File uploaded!', file: newFile });
  } catch (error) {
    console.error('❌ Upload error:', error);
    endTimer('⏱️ Total Upload');
    return res.status(500).json({ error: 'Upload failed.' });
  }
});

// ========= Get user files =========
router.get('/user-files', authenticateJWT, async (req, res) => {
  startTimer('⏱️ GET /user-files');

  try {
    const userId = (req as any).user?.id as string;
    if (!userId) {
      return res.status(400).json({ error: 'User ID missing' });
    }

    const key = cacheKeyFor(userId);

    // Try Redis list first
    const rows = await redis.lrange(key, 0, -1);
    if (rows.length > 0) {
      const files = rows.map((r) => JSON.parse(r));
      return res.status(200).json({ files });
    }

    // Cache miss -> fetch from DB (newest first)
    const files = await prisma.file.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        alias: true,
        cid: true,
        fileName: true,
        mimeType: true,
        pinSize: true,
        createdAt: true,
      },
    });

    if (files.length) {
      // Hydrate cache in order (newest first) using RPUSH
      const pipeline = redis.multi();
      files.forEach((f) => pipeline.rpush(key, JSON.stringify(f)));
      pipeline.expire(key, CACHE_TTL_SECONDS);
      await pipeline.exec();
    }

    return res.status(200).json({ files });
  } catch (error) {
    console.error('Error fetching user files:', error);
    return res.status(500).json({ error: 'Failed to fetch files' });
  } finally {
    endTimer('⏱️ GET /user-files');
  }
});

// ========= Retrieve by alias =========
router.post('/retrieve', authenticateJWT, async (req, res) => {
  startTimer('⏱️ POST /retrieve');
  try {
    const { alias, password } = req.body;
    const userId = (req as any).user?.id as string;

    if (!alias || !userId) {
      return res.status(400).json({ error: 'Alias and user ID required' });
    }

    const file = await prisma.file.findFirst({
      where: { uploadedBy: userId, alias },
      select: { cid: true, password: true },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found for the given alias' });
    }

    if (file.password && file.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    return res.status(200).json({ cid: file.cid });
  } catch (error) {
    console.error('Error in /retrieve:', error);
    return res.status(500).json({ error: 'Failed to retrieve file. Try again.' });
  } finally {
    endTimer('⏱️ POST /retrieve');
  }
});


export default router;
