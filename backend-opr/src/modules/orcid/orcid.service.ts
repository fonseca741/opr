import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { config } from 'src/config/env';
import { OrcidCredentials } from './orcid.types';

@Injectable()
export class OrcidService {
  async getCredentials(orcId: string): Promise<OrcidCredentials> {
    try {
      const data = new URLSearchParams();
      data.append('client_id', config.orcid.clientId);
      data.append('client_secret', config.orcid.clientSecret);
      data.append('grant_type', 'authorization_code');
      data.append('code', orcId);
      data.append('redirect_uri', config.orcid.redirectUri);

      return (
        await axios.post(`${config.orcid.apiUrl}/oauth/token`, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      ).data;
    } catch (err) {
      throw new Error(err);
    }
  }
}
