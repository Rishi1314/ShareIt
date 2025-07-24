import express from 'express';
import multer from 'multer';
import { authenticateJWT } from '../middleware/authenticate';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/ipfs', authenticateJWT, upload.none(), async (req, res) => {
  try {
    const { alias, password, ipfsResponse } = req.body;
    const userId = (req as any).user?.id;

    // Validate required inputs
    if (!alias || !ipfsResponse || !userId) {
      return res.status(400).json({ error: 'Alias, IPFS response, and user ID are required.' });
    }

    const parsed = JSON.parse(ipfsResponse);

    // Check: Does the alias already exist for this user?
    const existingFile = await prisma.file.findFirst({
      where: {
        alias,
        uploadedBy: userId,
      },
    });

    if (existingFile) {
      return res.status(409).json({ error: `Alias "${alias}" already exists. Please choose a different name.` });
    }

    // Check: Optional - Has this exact CID already been uploaded by this user?
    const cidCheck = await prisma.file.findFirst({
      where: {
        cid: parsed.IpfsHash,
        uploadedBy: userId,
      },
    });

    if (cidCheck) {
      return res.status(409).json({ error: `File with same content already uploaded (CID: ${parsed.IpfsHash}).` });
    }

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

    console.log('📦 File uploaded:', newFile);
    res.status(201).json({ message: '✅ File uploaded and saved!', file: newFile });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file. Please try again.' });
  }
});

router.get('/user-files', authenticateJWT, async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID missing' });
    }

    const files = await prisma.file.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: 'desc' },
    });
    console.log('📂 User files fetched:', files);
    res.status(200).json({ files });
  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

router.post('/retrieve', authenticateJWT, async (req, res) => {
  try {
    const { alias, password } = req.body;
    const userId = (req as any).user?.id;

    if (!alias || !userId) {
      return res.status(400).json({ error: 'Alias and user ID required' });
    }

    const file = await prisma.file.findFirst({
      where: {
        uploadedBy: userId,
        alias: alias,
      },
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
  }
});


export default router;
