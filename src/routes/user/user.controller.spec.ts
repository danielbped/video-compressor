import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserResponse, LoginResponse } from '../../interface/response.interface';

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      create: jest.fn(),
      login: jest.fn(),
    } as any;

    userController = new UserController(userService);
  });

  describe('create', () => {
    it('should call userService.create with correct params and return result', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const expectedResponse: CreateUserResponse = { id: '1', email: 'john@example.com' } as any;
      userService.create.mockResolvedValue(expectedResponse);

      const result = await userController.create(req);

      expect(userService.create).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(result).toBe(expectedResponse);
    });

    it('should throw if userService.create throws', async () => {
      const req = { body: { firstName: '', lastName: '', email: '', password: '' } };
      userService.create.mockRejectedValue(new Error('fail'));
      await expect(userController.create(req)).rejects.toThrow('fail');
    });
  });

  describe('login', () => {
    it('should call userService.login with correct params and return result', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const expectedResponse: LoginResponse = { token: 'jwt-token' } as any;
      userService.login.mockResolvedValue(expectedResponse);

      const result = await userController.login(req);

      expect(userService.login).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      });
      expect(result).toBe(expectedResponse);
    });

    it('should throw if userService.login throws', async () => {
      const req = { body: { email: '', password: '' } };
      userService.login.mockRejectedValue(new Error('login fail'));
      await expect(userController.login(req)).rejects.toThrow('login fail');
    });
  });
});