import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
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

  @IsArray()
  reviewers: number[];

  @IsNotEmpty()
  @IsArray()
  chairs: number[];

  @IsString()
  creatorInfos: string;
}
