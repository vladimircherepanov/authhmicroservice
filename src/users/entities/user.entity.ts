import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Entity()
@Unique(['login'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  firstname: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  confirmed: boolean;

  @Column()
  avatarLink: string;

  @Column()
  phone: string;

  @Column()
  provider: string;

  @Column()
  version: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @Column({ type: 'bigint' })
  updatedAt: number;

  /////////////////////

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10); //process.env.CRYPT_SALT);
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
