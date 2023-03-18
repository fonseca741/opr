import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsNumber()
  creator: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  description: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsNotEmpty()
  @IsArray()
  reviewers: number[];

  @IsString()
  creatorInfos: string;
}
