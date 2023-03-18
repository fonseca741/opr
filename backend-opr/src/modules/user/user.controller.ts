import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDTO) {
    try {
      return await this.userService.login(loginUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    try {
      await this.userService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async loadAllUsers() {
    return await this.userService.loadAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async loadUserById(@Param() { id }) {
    return await this.userService.loadUserById({ id });
  }

  @Get('role/:role')
  @UseGuards(AuthGuard)
  async loadUserByRole(@Param() { role }) {
    return await this.userService.loadUserByRole({ role });
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(@Param() { id }, @Body() updateUserDto: UpdateUserDTO) {
    await this.userService.updateUser(id, updateUserDto);
  }
}
