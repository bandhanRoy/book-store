import { HttpService } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { httpServiceMock } from '../../../../test/mocks/http-service.mock';
import { rootMongooseTestModule } from '../../../../test/setup';
import { HealthController } from '../health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [rootMongooseTestModule(), TerminusModule],
      providers: [
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkHealth()', () => {
    it('should return happy result', async () => {
      try {
        const data = await controller.check();
        // TODO: check this down problem
        expect(data).toStrictEqual({
          status: 'ok',
          info: { server: { status: 'down' }, database: { status: 'up' } },
          error: {},
          details: { server: { status: 'down' }, database: { status: 'up' } },
        });
      } catch (error) {
        expect(true).toBe(false);
      }
    });
  });
});
