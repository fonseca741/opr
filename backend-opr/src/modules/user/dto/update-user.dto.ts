import { IsOptional } from 'class-validator';
import { OneOf } from 'src/decorators';

export class UpdateUserDTO {
  @IsOptional()
  name: string;

  @IsOptional()
  @OneOf(['admin', 'author', 'publisher', 'reviewer'])
  role: string;

  @IsOptional()
  isActive: boolean;
}
