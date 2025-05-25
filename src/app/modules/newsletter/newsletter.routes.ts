import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import { newsletterValidation } from './newsletter.validation';
import validateRequest from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/subscribe',
  validateRequest(newsletterValidation.subscribe),
  NewsletterController.createSubscribe
);

router.delete(
  '/unsubscribe/:email',
  validateRequest(newsletterValidation.unsubscribe),
  NewsletterController.unsubscribe
);

router.get(
  '/subscribers',
  NewsletterController.getAllSubscribers
);

export const NewsletterRoutes = router;