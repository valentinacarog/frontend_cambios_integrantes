import { Router } from 'express';
import {
  getRetos,
  getRetoById,
  createReto,
  updateReto,
  deleteReto
} from './retosController.js';

const router = Router();

router.get('/', getRetos);
router.get('/:id', getRetoById);
router.post('/', createReto);
router.put('/:id', updateReto);
router.delete('/:id', deleteReto);

export default router;
