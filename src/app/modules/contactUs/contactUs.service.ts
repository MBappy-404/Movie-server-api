import { PrismaClient } from '@prisma/client';
import { ICreateContactUs, IContactUs } from './contactUs.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import prisma from '../../helper/prisma';

const createContact = async (data: ICreateContactUs): Promise<IContactUs> => {
  try {
    const existingContact = await prisma.contactUs.findUnique({
      where: { email: data.email }
    });

    if (existingContact) {
      throw new AppError(status.BAD_REQUEST, 'A contact form with this email already exists');
    }

    const contact = await prisma.contactUs.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        subject: data.subject,
        message: data.message
      }
    });

    return contact;
  } catch (error) {
    throw error;
  }
};

const getAllContacts = async (): Promise<IContactUs[]> => {
  try {
    return await prisma.contactUs.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    throw error;
  }
};

const getContactById = async (id: string): Promise<IContactUs> => {
  try {
    const contact = await prisma.contactUs.findUnique({
      where: { id }
    });

    if (!contact) {
      throw new AppError(status.BAD_REQUEST, 'Contact not found');
    }

    return contact;
  } catch (error) {
    throw error;
  }
};

const deleteContact = async (id: string): Promise<void> => {
  try {
    const contact = await prisma.contactUs.findUnique({
      where: { id }
    }); 

    if (!contact) {
      throw new AppError(status.BAD_REQUEST, 'Contact not found');
    }

    await prisma.contactUs.delete({
      where: { id }
    }); 
  } catch (error) {
    throw error;
  }
};



export const ContactUsService = {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact
};