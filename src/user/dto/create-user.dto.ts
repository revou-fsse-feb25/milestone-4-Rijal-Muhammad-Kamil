import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama harus diisi' })
  @MinLength(3, { message: 'Nama harus terdiri dari minimal 3 karakter' })
  @MaxLength(30, { message: 'Nama tidak boleh lebih dari 30 karakter' })
  @Matches(/^[a-zA-Z\s'\-]*$/, { message: 'Nama hanya boleh mengandung huruf, spasi, apostrof, dan tanda minus' })
  @Transform(({ value }) => value.trim())
  name: string;

  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email harus diisi' })
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password harus diisi' })
  @MinLength(6, { message: 'Password harus terdiri dari minimal 6 karakter' })
  @MaxLength(30, { message: 'Password tidak boleh lebih dari 30 karakter' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,30}$/, { message: 'Password harus mengandung setidaknya satu huruf kapital, satu angka, dan satu karakter spesial' })
  @Transform(({ value }) => value.trim())
  password: string;
}
