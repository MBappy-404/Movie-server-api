export interface IContactUs {
  id: string;
  email: string;
  fullName: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateContactUs {
  email: string;
  fullName: string;
  subject: string;
  message: string;
} 