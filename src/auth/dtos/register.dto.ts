import { IsArray, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Identificacion tiene que ser alfanumérico',
  })
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  roles?: string[];
}
