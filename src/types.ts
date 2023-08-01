// import type { Entity } from 'dynamodb-toolbox';
import type { Model } from 'dynamoose/dist/Model';
import type {
  Context as LambdaContext,
  APIGatewayProxyEventV2,
  APIGatewayProxyEvent,
} from 'aws-lambda';
import type { UserItem } from './users/MagicUser.model';
import type { SessionItem } from './sessions/GameSession.model';
import type { InviteItem } from './invites/Invite.model';

export type Headers = { [key: string]: string };

export type GatewayEvent = APIGatewayProxyEvent | APIGatewayProxyEventV2;
export interface LambdaContextFunctionArgument {
  event: GatewayEvent;
  context: LambdaContext & { headers: Headers };
}

export type IdObject = {
  id: string;
};

export type Context = {
  MagicUser: Model<UserItem>;
  GameSession: Model<SessionItem>;
  Invite: Model<InviteItem>;
  headers: Headers;
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

  // these are all optional and ONLY SHOW UP ON FAILURES
  id?: string;
  email?: string;
  error?: string;
};
