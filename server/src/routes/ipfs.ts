import express from 'express';
import multer from 'multer';
import { authenticateJWT } from '../middleware/authenticate';
import { PrismaClient } from '@prisma/client';
import redis from '../utils/redis';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to wrap timers safely
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

router.post('/ipfs', authenticateJWT, upload.none(), async (req, res) => {
  startTimer('⏱️ Total Upload');

  try {
    const { alias, password, ipfsResponse } = req.body;
    const userId = (req as any).user?.id;

    if (!alias || !ipfsResponse || !userId) {
      return res.status(400).json({ error: 'Alias, IPFS response, and user ID are required.' });
    }

    startTimer('⏱️ Parse IPFS');
    const parsed = JSON.parse(ipfsResponse);
    endTimer('⏱️ Parse IPFS');

    startTimer('⏱️ Check Alias');
    const existingFile = await prisma.file.findFirst({
      where: { alias, uploadedBy: userId },
      select: { id: true }, // optimization tip
    });
    endTimer('⏱️ Check Alias');

    if (existingFile) {
      return res.status(409).json({ error: `Alias "${alias}" already exists.` });
    }

    startTimer('⏱️ Check CID');
    const cidCheck = await prisma.file.findFirst({
      where: { cid: parsed.IpfsHash, uploadedBy: userId },
      select: { id: true }, // optimization tip
    });
    endTimer('⏱️ Check CID');

    if (cidCheck) {
      return res.status(409).json({ error: `File with same CID already exists.` });
    }

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
    });
    endTimer('⏱️ Create Record');

    endTimer('⏱️ Total Upload');
    return res.status(201).json({ message: '✅ File uploaded!', file: newFile });

  } catch (error) {
    console.error('❌ Upload error:', error);
    endTimer('⏱️ Total Upload');
    return res.status(500).json({ error: 'Upload failed.' });
  }
});



router.get('/user-files', authenticateJWT, async (req, res) => {
  startTimer('⏱️ GET /user-files');

  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID missing' });
    }

    const cacheKey = `files:user:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log('📦 Cache hit!');
      console.log('📦 Cached files:', JSON.parse(cached));
      return res.status(200).json({ files: JSON.parse(cached) });
    }

    console.log('📡 Cache miss. Fetching from DB...');
    const files = await prisma.file.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: 'desc' },
    });

    await redis.set(cacheKey, JSON.stringify(files), 'EX', 600); // cache for 10 minutes
    return res.status(200).json({ files });

  } catch (error) {
    console.error('Error fetching user files:', error);
    return res.status(500).json({ error: 'Failed to fetch files' });
  } finally {
    endTimer('⏱️ GET /user-files');
  }
});

router.post('/retrieve', authenticateJWT, async (req, res) => {
  startTimer('⏱️ POST /retrieve');
  try {
    const { alias, password } = req.body;
    const userId = (req as any).user?.id;

    if (!alias || !userId) {
      return res.status(400).json({ error: 'Alias and user ID required' });
    }

    const file = await prisma.file.findFirst({
      where: { uploadedBy: userId, alias },
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
