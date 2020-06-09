import * as querystring from 'querystring';

import Transporter from '../Transporter';

export interface Token {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  scope: string;
  token_type: string;
}

class GoogleOAuth2 {
  private clientId: string;
  private clientSecret: string;
  private redirectUrl: string;
  private transporter: Transporter;

  /**
   * The base URL for auth endpoints.
   */
  private static readonly GOOGLE_OAUTH2_AUTH_BASE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

  /**
   * The base endpoint for token retrieval.
   */
  private static readonly GOOGLE_OAUTH2_TOKEN_URL = 'https://oauth2.googleapis.com/token';

  constructor(clientId: string, clientSecret: string, redirectUrl: string, transporter: Transporter) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUrl = redirectUrl;
    this.transporter = transporter;
  }

  public generateAuthUrl(scope: string | string[]) {
    scope = (scope instanceof Array) ? scope : [scope];

    const opts = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      scope: scope.join(' ')
    };

    return GoogleOAuth2.GOOGLE_OAUTH2_AUTH_BASE_URL + '?' + querystring.stringify(opts);
  }

  public getToken(code: string) {
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify({
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUrl,
        grant_type: 'authorization_code'
      })
    };

    return this.transporter(GoogleOAuth2.GOOGLE_OAUTH2_TOKEN_URL, reqOpts)
      .then(response => response.json());
  }

  public refreshToken(refreshToken: string) {
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify({
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token'
      })
    }

    return this.transporter(GoogleOAuth2.GOOGLE_OAUTH2_TOKEN_URL, reqOpts)
      .then(response => response.json())
      .then(data => Object.assign({}, data, { refresh_token: refreshToken }))
      .then(data => this.createToken(data));
  }

  private createToken(data: any): Token {
    return {
      access_token: data.access_token,
      expiry_date: new Date().getTime() + data.expires_in * 1000,
      refresh_token: data.refresh_token,
      scope: data.scope,
      token_type: data.token_type
    }
  }
}

export default GoogleOAuth2;
