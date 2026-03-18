import express from 'express';
import { getChecklists, createChecklist, updateChecklist, deleteChecklist } from '../controllers/checklistController.js';
import upload from '../middlewares/upload.js';
import verifyPin from '../middlewares/verifyPin.js';

const router = express.Router();

router.get('/', getChecklists);
router.post('/', upload.single('image'), verifyPin, createChecklist);
router.put('/:id', upload.single('image'), verifyPin, updateChecklist);
router.delete('/:id', verifyPin, deleteChecklist);

export default router;
