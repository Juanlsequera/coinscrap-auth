import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
// import { JwtStrategy } from './guards/jwt.strategy';
// import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ message: 'User registered' }),
            login: jest.fn().mockResolvedValue({ access_token: 'mocked_token' }),
            findProfile: jest.fn().mockResolvedValue({ id: '123', username: 'testuser' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const registerDto: RegisterDto = { identifier: 'testuser', password: 'password123' };
    const result = await authController.register(registerDto);
    expect(result).toEqual({ message: 'User registered' });
    expect(authService.register).toHaveBeenCalledWith(registerDto);
  });

  it('should login a user', async () => {
    const loginDto: LoginDto = { identifier: 'testuser', password: 'password123' };
    const result = await authController.login(loginDto);
    expect(result).toEqual({ access_token: 'mocked_token' });
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });

  it('should get user profile', async () => {
    const mockRequest = { user: { userId: '123' } } as any;
    const result = await authController.getProfile(mockRequest);
    expect(result).toEqual({ id: '123', username: 'testuser' });
    expect(authService.findProfile).toHaveBeenCalledWith('123');
  });
});
