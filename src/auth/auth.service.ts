import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/entities/users.schema';
import { TokenPayload } from './types/token-payload.interface';
import { TokenResponse } from './types/token-response.interface';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserProfileDTO } from './dtos/userProfile.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  private validateIdentifier(identifier: string): boolean {
    const identifierRegex = /^[a-zA-Z0-9_]+$/;
    return identifierRegex.test(identifier);
  }

  async register(registerDto: RegisterDto): Promise<TokenResponse> {
    if (!this.validateIdentifier(registerDto.identifier)) {
      throw new BadRequestException('El identificador tiene un formato incorrecto');
    }
  
    const userExists = await this.userModel.findOne({ identifier: registerDto.identifier });
    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }
  
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    
    
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });
    user.permissions = this.getPermissionsByRoles(user.roles);  
    const savedUser = await user.save();  
    return this.generateTokens(savedUser);
  }
  
  async validateUser(identifier: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ identifier });
    if (!user) {
      console.log('Usuario no encontrado');
      return null;
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Contraseña incorrecta');
      return null;
    }
  
    user.permissions = this.getPermissionsByRoles(user.roles);
    return user;
  }

  getPermissionsByRoles(roles: string[]): string[] {
    const permissionsMap = {
      admin: ['read', 'write', 'delete'],
      user: ['read'],
      editor: ['read', 'write'],
    };

    return Array.from(new Set(roles.flatMap(role => permissionsMap[role] || [])));
  }
  async login(loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.validateUser(
      loginDto.identifier,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.generateTokens(user);
  }

  private generateTokens(user: UserDocument): TokenResponse {
    const payload: TokenPayload = {
      sub: user.id.toString(),
      iat: Date.now(),
      permissions: user.permissions,
    };
  
    const accessToken = this.jwtService.sign(payload);
  
    const refreshToken = this.jwtService.sign(
      { sub: user.id.toString() },
      {
        secret: process.env.JWT_REFRESH_SECRET,
      }
    );
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Token de refresh inválido');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Token de refresh inválido');
    }
  }

  async findProfile(id: string): Promise<UserProfileDTO | null> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
        return null;
    }

    return new UserProfileDTO(user);
}
}
