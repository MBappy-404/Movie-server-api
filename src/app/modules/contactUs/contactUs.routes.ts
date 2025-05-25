import { Router } from 'express';
import { contactUsValidation } from './contactUs.validation';
import validateRequest from '../../middleware/validateRequest';
import { ContactUsController } from './contactUs.controller';

const router = Router();

router.post(
  '/',
  validateRequest(contactUsValidation.createContact),
  ContactUsController.createContact
);

router.get(
  '/',
  ContactUsController.getAllContacts
);

router.get(
  '/:id',
  validateRequest(contactUsValidation.getContactById),
  ContactUsController.getContactById
);

router.delete(
  '/:id',
  ContactUsController.deleteContact
);


export const ContactUsRoutes = router;