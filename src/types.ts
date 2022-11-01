// import type { Entity } from 'dynamodb-toolbox';
import type { Model } from 'dynamoose/dist/Model';
import type { Item } from 'dynamoose/dist/Item';
import type {
  Context as LambdaContext,
  APIGatewayProxyEventV2,
  APIGatewayProxyEvent,
} from 'aws-lambda';

export type GatewayEvent = APIGatewayProxyEvent | APIGatewayProxyEventV2;
export interface LambdaContextFunctionArgument {
  event: GatewayEvent;
  context: LambdaContext;
}

export type UserType = {
  secretToken?: string | null;
  createdAt: string;
  updatedAt: string;
  settings: any;
  email: string;
  name?: string;
  type: string; // magic | google | etc.
  id: string;
};
export type MagicUserItem = Item & UserType;

export type IdObject = {
  id: string;
};

export type Context = {
  MagicUser: Model<MagicUserItem>;
  setCookies: any[];
  setHeaders: any[];
  email?: string;
  type?: string;
  id?: string;
  event: any;
};

export type Token = {
  id: string;
  type: string; // magic | google | etc.
  email: string;
};

export type Affirmative = {
  ok: Boolean;
};
