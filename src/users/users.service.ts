import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async getById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return { user };
    }
    return false;
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email }, //, provider: In(['M', 'MG']) } ,
    });
    if (user) {
      return { user };
    }
    return false;
  }

  async getByEmailAndProvider(email: string, provider) {
    const user = await this.usersRepository.findOne({
      where: { email: email, provider: In(provider) },
    });
    if (user) {
      return { user };
    }
    return false;
  }

  async create(signUpData) {
    const user = await this.usersRepository.create({
      id: uuidv4(),
      login: signUpData.email,
      firstname: signUpData.firstname,
      surname: signUpData.surname,
      email: signUpData.email,
      password: signUpData.password,
      role: 'user',
      confirmed: false,
      avatarLink: '',
      phone: '',
      provider: 'M',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const savedUser = await this.usersRepository.save(user);

    const { id, email, firstname, surname, role, confirmed, avatarLink } =
      savedUser;
    return { id, email, firstname, surname, role, confirmed, avatarLink };
  }

  async createSocial(signUpData) {
    const existingUser = await this.getByEmail(signUpData.email);
    if (existingUser) {
    } else {
      const user = this.usersRepository.create({
        id: uuidv4(),
        login: signUpData.email,
        firstname: signUpData.given_name,
        surname: signUpData.family_name,
        email: signUpData.email,
        password: signUpData.email,
        role: 'user',
        confirmed: true,
        avatarLink: signUpData.picture,
        phone: '',
        provider: 'G',
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      const savedUser = await this.usersRepository.save(user);
      const { id, email, firstname, surname, role, confirmed, avatarLink } =
        savedUser;
      return { id, email, firstname, surname, role, confirmed, avatarLink };
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
