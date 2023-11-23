import { IsNotEmpty, IsString } from 'class-validator';

export class OrcidLoginDto {
  @IsNotEmpty()
  @IsString()
  orcidCode: string;
}
