export interface INewsletter {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNewsletter {
  email: string;
} 