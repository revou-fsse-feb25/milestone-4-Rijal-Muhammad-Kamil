import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    service = new PrismaService();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should call $connect successfully', async () => {
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });

    it('should throw if $connect fails', async () => {
      const error = new Error('Connection failed');
      jest.spyOn(service, '$connect').mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect successfully', async () => {
      const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue();

      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should throw if $disconnect fails', async () => {
      const error = new Error('Disconnection failed');
      jest.spyOn(service, '$disconnect').mockRejectedValue(error);

      await expect(service.onModuleDestroy()).rejects.toThrow('Disconnection failed');
    });
  });
});
