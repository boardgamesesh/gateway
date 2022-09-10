export type User = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Input = {
  input: Partial<User>;
};

export type IdObject = {
  id: string;
};

export type Context = {
  dataSources: any;
  hashKey?: string;
};

export type GenericUserPayload = {
  success: boolean;
  item?: User;
};
