import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupUserDto: SignupUserDto): Promise<any> {
    const existingUser = await this.usersService.findByUsername(signupUserDto.username); 
    
    if (existingUser) {
      return { message: 'Username already exists' };
    }

    const hashedPassword = await bcrypt.hash(signupUserDto.password, 10);
    const user = await this.usersService.create({
      ...signupUserDto,
      password: hashedPassword,
    });

    return {
      message: 'User successfully registered',
      userId: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email); 
    const isPasswordCorrect =   bcrypt.compare(password, user.password); 

    if (!!user && !!isPasswordCorrect) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginUserDto: LoginUserDto): Promise<{ user: User, token: string }> {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    if(!!user) delete user.password; 
    const payload = { username: user.username, sub: user.id };
    return {
      user: user,
      token: this.jwtService.sign(payload),
    };
  }
}
