import { Table } from 'dynamoose';

export type UserType = {
  secretToken: string | null;
  createdAt: string;
  updatedAt: string;
  settings: any;
  email: string;
  name: string;
  type: string; // magic | google | etc.
  id: string;
};

export type IdObject = {
  id: string;
};

export type Context = {
  dataSources: {
    userSource: typeof Table;
  };
  callbackWaitsForEmptyEventLoop?: boolean;
  email: string;
  type: string;
  id: string;
};

export type Token = {
  id: string;
  type: string; // magic | google | etc.
  email: string;
};

export type Affirmative = {
  ok: Boolean;
};
