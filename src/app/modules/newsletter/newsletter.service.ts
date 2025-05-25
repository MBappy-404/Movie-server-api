import { PrismaClient } from '@prisma/client';
import { ICreateNewsletter, INewsletter } from './newsletter.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';

const prisma = new PrismaClient();

const createSubscribe = async (data: ICreateNewsletter): Promise<INewsletter> => {
    try {
      const existingSubscriber = await prisma.newsletter.findUnique({
        where: { email: data.email }
      });

      if (existingSubscriber) {
        throw new AppError( status.BAD_REQUEST, 'Email already subscribed');
      }

      const subscriber = await prisma.newsletter.create({
        data: {
          email: data.email
        }
      });

      return subscriber;
    } catch (error) {
      throw error;
    }
  }

  const unsubscribe = async (email: string): Promise<void> => {
    try {
      const subscriber = await prisma.newsletter.findUnique({
        where: { email }
      });

      if (!subscriber) {
        throw new AppError(status.BAD_REQUEST, 'Email not found in subscribers list');
      }

      await prisma.newsletter.delete({
        where: { email }
      });
    } catch (error) {
      throw error;
    }
  }

  const getAllSubscribers = async (): Promise<INewsletter[]> => {
    try {
      return await prisma.newsletter.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw error;
    }
  }

  export const NewsletterService = {
    createSubscribe,
    unsubscribe,
    getAllSubscribers
  };