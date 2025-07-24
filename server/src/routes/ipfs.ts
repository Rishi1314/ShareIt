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

export default router;
