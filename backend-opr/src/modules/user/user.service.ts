import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/databases/postgres/entities/user-entity';
import { config } from 'src/config/env';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async login(loginUserDto: LoginUserDTO) {
    const userExists = await this.repository.findOne({
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      where: {
        email: loginUserDto.email,
      },
    });

    if (!userExists) {
      throw new Error('User not found with this email!');
    }

    if (!(await userExists.checkPassword(loginUserDto.password))) {
      throw new Error('Password is incorrect!');
    }

    if (!userExists.isActive) {
      throw new Error('User is not active!');
    }

    return {
      user: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
        isActive: userExists.isActive,
        createdAt: userExists.createdAt,
        updatedAt: userExists.updatedAt,
      },
      token: sign(
        {
          role: userExists.role,
          email: userExists.email,
        },
        config.auth.secret,
        {
          expiresIn: config.auth.expiresIn,
        },
      ),
    };
  }

  async create(createUserDto: CreateUserDTO) {
    const userAlreadyExists = await this.repository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (userAlreadyExists) {
      throw new Error('User already registered with this email!');
    }

    const user = this.repository.create(createUserDto);

    await this.repository.save(user);
  }

  async loadAllUsers() {
    return await this.repository.find();
  }

  async loadUserById({ id }) {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }

  async loadUserByRole({ role }) {
    return await this.repository.find({
      where: [
        {
          role,
          isActive: true,
        },
        {
          role: 'admin',
          isActive: true,
        },
      ],
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDTO) {
    await this.repository.update(id, updateUserDto);
  }
}
