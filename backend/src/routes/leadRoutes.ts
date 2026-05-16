import { Router } from 'express';
import { check } from 'express-validator';
import { authenticateJWT, requireRole } from '../middlewares/auth';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCsv
} from '../controllers/leadController';

const router = Router();

router.use(authenticateJWT);

router.get('/export', exportLeadsCsv);

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('source', 'Source is required').not().isEmpty(),
  ],
  createLead
);

router.get('/', getLeads);
router.get('/:id', getLeadById);

router.put(
  '/:id',
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
  ],
  updateLead
);

router.delete('/:id', requireRole(['Admin']), deleteLead);

export default router;
