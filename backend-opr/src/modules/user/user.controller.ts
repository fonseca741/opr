import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from './dto';
import { OrcidLoginDto } from './dto/orcid-login';
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

  @Post('orcid')
  async orcidLogin(@Body() orcidLoginDto: OrcidLoginDto) {
    try {
      return await this.userService.orcidLogin(orcidLoginDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDTO,
    @Query() shouldLogin = false,
  ) {
    try {
      await this.userService.create(createUserDto);

      if (shouldLogin) {
        return await this.userService.login({
          email: createUserDto.email,
          password: createUserDto.password,
        });
      }
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
