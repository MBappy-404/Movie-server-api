import { Request, Response } from 'express';
import { ContactUsService } from './contactUs.service';
import { catchAsync } from '../../helper/catchAsync';
import sendResponse from '../../helper/sendResponse';
import status from 'http-status';


  const createContact = catchAsync(async (req: Request, res: Response) => {
    const contact = await ContactUsService.createContact(req.body);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: 'Successfully created contact',
      data: contact
    });
  });

  const  getAllContacts = catchAsync(async (req: Request, res: Response) => {
    const contacts = await ContactUsService.getAllContacts();
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Successfully fetched all contacts',
      data: contacts
    });
  });

  const  getContactById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const contact = await ContactUsService.getContactById(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Successfully fetched contact',
      data: contact
    });
  });

  const deleteContact = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await ContactUsService.deleteContact(id);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Successfully deleted contact',
      data: null
    });
  });

  export const ContactUsController = {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
  };
