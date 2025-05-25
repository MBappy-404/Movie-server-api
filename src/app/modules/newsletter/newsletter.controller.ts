import { Request, Response } from 'express';
import { NewsletterService } from './newsletter.service';
import { catchAsync } from '../../helper/catchAsync';
import sendResponse from '../../helper/sendResponse';
import status from 'http-status';



  const createSubscribe = catchAsync(async (req: Request, res: Response) => {
    const subscriber = await NewsletterService.createSubscribe(req.body);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscriber
    });
  });

  const unsubscribe = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.params;
    await NewsletterService.unsubscribe(email);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  });

  const getAllSubscribers = catchAsync(async (req: Request, res: Response) => {
    const subscribers = await NewsletterService.getAllSubscribers();
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Successfully fetched all subscribers',
      data: subscribers
    });
  });

  export const NewsletterController = {
    createSubscribe,
    unsubscribe,
    getAllSubscribers
  };
