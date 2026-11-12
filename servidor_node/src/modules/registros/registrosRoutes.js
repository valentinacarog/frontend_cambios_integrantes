import { Router } from 'express';
import {
  getRegistros,
  getRegistroById,
  createRegistro,
  updateRegistro,
  deleteRegistro
} from './registrosController.js';

const router = Router();

router.get('/', getRegistros);
router.get('/:id', getRegistroById);
router.post('/', createRegistro);
router.put('/:id', updateRegistro);
router.delete('/:id', deleteRegistro);

export default router;
