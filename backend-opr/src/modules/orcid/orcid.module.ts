import { Module } from '@nestjs/common';
import { OrcidService } from './orcid.service';

@Module({
  providers: [OrcidService],
  exports: [OrcidService],
})
export class OrcidModule {}
