import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { GlobalExceptionHandler } from '../global-exception.handler';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

const mockAppLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn().mockReturnValue({
    originalUrl: '/',
    method: 'GET',
    params: undefined,
    query: { debug: true },
    body: undefined,
  }),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('System header validation service', () => {
  let service: GlobalExceptionHandler;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalExceptionHandler,
        {
          provide: Logger,
          useValue: mockAppLoggerService,
        },
        ConfigService,
      ],
    }).compile();
    module.createNestApplication();
    service = module.get<GlobalExceptionHandler>(GlobalExceptionHandler);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Http exception', () => {
      (service['httpAdapterHost'] as unknown) = {
        httpAdapter: {
          getRequestUrl: (): string => 'hello',
          reply: jest.fn(),
        },
      };
      service.catch(
        new HttpException('Http exception', HttpStatus.BAD_REQUEST),
        mockArgumentsHost
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(
        service['httpAdapterHost']['httpAdapter']['reply']
      ).toHaveBeenCalled();
    });
  });
});
