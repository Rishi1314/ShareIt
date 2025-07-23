import express from 'express';
import multer from 'multer';
import { authenticateJWT } from '../middleware/authenticate';
import { PinataSDK } from "pinata"
import { log } from 'console';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory buffer

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || '',
  pinataGateway: process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud',
})

router.get('/test', (_, res) => {
  res.send('IPFS Upload Route');
});

router.post(
  '/ipfs',
  authenticateJWT,
  upload.single('file'), // 👈 this is the missing piece!
  async (req, res) => {
    try {
      const { alias, password } = req.body;
      const file = req.file;
      const userId = (req as any).user?.id;
      if (!file || !alias || !userId) {
        return res.status(400).json({ error: 'Alias, file, and user are required.' });
      }
            console.log('Upload received:', file);
       
      // const upload = await pinata.upload.public.file(file);

          // console.log(upload);

      // Respond with success
      res.status(200).json({ message: 'File uploaded successfully', alias });
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      res.status(500).json({ error: 'Failed to upload file. Please try again.' });
    }
  }
);

export default router;
