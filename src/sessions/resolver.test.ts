import { queries, mutations } from './resolver';

jest.mock('nanoid');

describe('gameSessionQueries', () => {
  const ownerId = 'owner-id';
  const id = 'game-session-id';
  const GameSession: any = {
    get: jest.fn(),
    query: jest.fn(),
  };
  const context: any = { GameSession };

  beforeEach(() => {
    GameSession.get.mockReset();
    GameSession.query.mockReset();
  });

  test('gameSession get', async () => {
    const gameSession = { id, ownerId };
    GameSession.get.mockResolvedValueOnce(gameSession);

    const result = await queries.gameSession(null, { id }, context);

    expect(GameSession.get).toHaveBeenCalledWith({ id });
    expect(result).toEqual(gameSession);
  });

  test('gameSessions query', async () => {
    const gameSessions = [
      { id: 'first-session', ownerId },
      { id: 'the-better-session', ownerId },
    ];
    GameSession.query.mockReturnValue({
      eq: jest.fn().mockReturnThis(),
      using: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(gameSessions),
    });

    const result = await queries.gameSessions(null, { ownerId }, context);

    expect(GameSession.query).toHaveBeenCalledWith('ownerId');
    expect(result).toEqual(gameSessions);
  });
}); // Assuming you have a types.ts or similar file containing your types

describe('mutations', () => {
  const partialGameSession: any = {
    name: 'Test Session',
    description: 'A test game session',
  };
  const GameSession: any = {
    update: jest.fn(),
    create: jest.fn(),
  };
  const mockContext: any = {
    id: 'test-user-id',
    GameSession,
  };
  const nanoid = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGameSession', () => {
    it('should throw an error if user is unauthorized', async () => {
      await expect(
        mutations.createGameSession({}, partialGameSession, { ...mockContext, id: undefined })
      ).rejects.toThrow('Unauthorized');
    });

    it('should create a new game session with the provided input and owner id', async () => {
      const newSession: any = {
        ...partialGameSession,
        ownerId: mockContext.id,
      };
      nanoid.mockReturnValueOnce(newSession.id);
      GameSession.create.mockResolvedValueOnce(newSession);

      const result = await mutations.createGameSession({}, partialGameSession, mockContext);
      expect(result).toEqual(newSession);
      expect(GameSession.create).toHaveBeenCalledWith(newSession);
    });
  });

  describe('updateGameSession', () => {
    const existingSession: any = {
      ...partialGameSession,
      id: 'existing-id',
      ownerId: mockContext.id,
    };

    it('should throw an error if the item is deleted or owned by another user', async () => {
      GameSession.update.mockImplementationOnce(() => {
        const error: any = new Error('Conditional check failed');
        error.code = 'ConditionalCheckFailedException';
        throw error;
      });

      await expect(
        mutations.updateGameSession({}, { input: existingSession }, mockContext)
      ).rejects.toThrow('Item deleted or owned by another user');
    });

    it('should update the game session with the provided input and owner id', async () => {
      const updatedSession: any = { ...existingSession, name: 'Updated Test Session' };
      GameSession.update.mockResolvedValueOnce(updatedSession);

      const result = await mutations.updateGameSession({}, { input: updatedSession }, mockContext);
      expect(result).toEqual(updatedSession);
      expect(GameSession.update).toHaveBeenCalledWith(
        { id: existingSession.id },
        { ...updatedSession, ownerId: mockContext.id },
        expect.any(Object)
      );
    });
  });
});
