import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { handleDatabaseError } from 'src/common/utils/handleDatabaseError';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // CREATE A NEW USER
  public async createSingleUser(createUserDto: CreateUserDto) {
    try {
      // check if user already exists using their email
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      // if user exists, prompt user to login
      if (existingUser) {
        this.logger.warn('User already exist! Kindly login');
        throw new ConflictException('User already exist! Kindly login');
      }

      // hash the provided password

      // create the user instance
      const user = this.usersRepository.create({
        ...createUserDto,
      });

      // add the business field to the user

      // save and return the user
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error('Failed to created new user');
      handleDatabaseError(error, {
        message: 'Failed to create new user',
        type: 'database',
      });
    }

    return createUserDto;
  }
}
