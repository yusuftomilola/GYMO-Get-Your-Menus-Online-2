import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dtos/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // CREATE A NEW USER
  @Post('new')
  public async createSingleUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createSingleUser(createUserDto);
  }
}
