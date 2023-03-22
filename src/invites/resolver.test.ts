import { nanoid } from 'nanoid';
import { mutations as userMutations } from '../users/resolver';
import { Context } from '../types';
import { InviteInput, queries, mutations } from './resolver';

jest.mock('nanoid');
jest.mock('../users/resolver');

const GameSession: any = {};
const MagicUser: any = {};
const Invite: any = {};

const mockedContext: Context | any = {
  GameSession,
  MagicUser,
  Invite,
};

describe('Invite Resolver', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    MagicUser.query = jest.fn().mockReturnThis();
    MagicUser.using = jest.fn().mockReturnThis();
    MagicUser.eq = jest.fn().mockReturnThis();

    Invite.query = jest.fn().mockReturnThis();
    Invite.using = jest.fn().mockReturnThis();
    Invite.eq = jest.fn().mockReturnThis();
  });

  describe('queries', () => {
    test('invites', async () => {
      const playerId = 'playerId';
      const mockInvites = [{ sessionId: 'session1' }, { sessionId: 'session2' }];
      const mockSessions = [{ id: 'session1' }, { id: 'session2' }];

      Invite.exec = jest.fn().mockResolvedValue(mockInvites);
      GameSession.batchGet = jest.fn().mockResolvedValue(mockSessions);

      const result = await queries.invites(undefined, { playerId }, mockedContext);

      expect(Invite.query).toHaveBeenCalledWith('userId');
      expect(Invite.eq).toHaveBeenCalledWith(playerId);
      expect(GameSession.batchGet).toHaveBeenCalledWith(
        mockInvites.map((invite) => invite.sessionId)
      );
      expect(result).toEqual(mockSessions);
    });
  });

  describe('mutations', () => {
    test('acceptInvite', async () => {
      const id = 'inviteId';
      const sessionId = 'sessionId';
      const userId = 'userId';
      const mockInvite = { sessionId, userId };
      const mockUpdatedSession = { id: sessionId, playerIds: [userId] };

      Invite.get = jest.fn().mockResolvedValue(mockInvite);
      GameSession.update = jest.fn().mockResolvedValue(mockUpdatedSession);
      Invite.delete = jest.fn().mockResolvedValue(undefined);
      MagicUser.update = jest.fn().mockResolvedValue(undefined);

      const result = await mutations.acceptInvite(undefined, { id }, mockedContext);

      expect(Invite.get).toHaveBeenCalledWith(id);
      expect(GameSession.update).toHaveBeenCalledWith(
        { id: sessionId },
        { $ADD: { playerIds: [userId] } },
        { returnValues: 'ALL_NEW' }
      );
      expect(Invite.delete).toHaveBeenCalledWith(id);
      expect(MagicUser.update).toHaveBeenCalledWith(
        { id: userId },
        { $ADD: { sessionIds: [sessionId] } }
      );
      expect(result).toEqual(mockUpdatedSession);
    });

    test('createInvite with id', async () => {
      const gameSessionId = 'gameSessionId';
      const id = 'userId';
      const inviteId = 'inviteId';
      const input: InviteInput = { gameSessionId, id };
      const createdInvite = { sessionId: gameSessionId, userId: id, id: inviteId };
      const updatedGameSession = { id: gameSessionId, invites: [inviteId] };

      (nanoid as jest.Mock).mockReturnValue(inviteId);
      MagicUser.query = jest.fn();
      userMutations.sendMagicLink = jest.fn();
      Invite.create = jest.fn().mockResolvedValue(createdInvite);
      GameSession.update = jest.fn().mockResolvedValue(updatedGameSession);

      const result = await mutations.createInvite(undefined, input, mockedContext);

      expect(MagicUser.query).not.toHaveBeenCalled();
      expect(userMutations.sendMagicLink).not.toHaveBeenCalled();
      expect(Invite.create).toHaveBeenCalledWith(createdInvite);
      expect(GameSession.update).toHaveBeenCalledWith(
        { id: gameSessionId },
        { $ADD: { invites: [inviteId] } },
        { returnValues: 'ALL_NEW' }
      );
      expect(result).toEqual(updatedGameSession);
    });

    test('createInvite with email', async () => {
      const gameSessionId = 'gameSessionId';
      const email = 'test@example.com';
      const userId = 'userId';
      const inviteId = 'inviteId';
      const input: InviteInput = { gameSessionId, email };
      const user = { id: userId };
      const createdInvite = { sessionId: gameSessionId, userId, id: inviteId };
      const updatedGameSession = { id: gameSessionId, invites: [inviteId] };

      (nanoid as jest.Mock).mockReturnValue(inviteId);
      MagicUser.exec = jest.fn().mockResolvedValue([user]);
      userMutations.sendMagicLink = jest.fn();
      Invite.create = jest.fn().mockResolvedValue(createdInvite);
      GameSession.update = jest.fn().mockResolvedValue(updatedGameSession);

      const result = await mutations.createInvite(undefined, input, mockedContext);

      expect(MagicUser.query).toHaveBeenCalledWith('email');
      expect(MagicUser.eq).toHaveBeenCalledWith(email);
      expect(userMutations.sendMagicLink).not.toHaveBeenCalled();
      expect(Invite.create).toHaveBeenCalledWith(createdInvite);
      expect(GameSession.update).toHaveBeenCalledWith(
        { id: gameSessionId },
        { $ADD: { invites: [inviteId] } },
        { returnValues: 'ALL_NEW' }
      );
      expect(result).toEqual(updatedGameSession);
    });
  });
});
