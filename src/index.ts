import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';

import Main from './Main';
import GoogleOAuth2 from './google/GoogleOAuth2';
import Telegram from './telegram/Telegram';

const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, '../credentials.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../users.json'), 'utf-8'));

if (!credentials.calendar) {
  console.error('You must provide calendar app credentials');

  process.exit(1);
}

if (!credentials.telegram) {
  console.error('You must provide telegram credentials');

  process.exit(1);
}

const authApi = new GoogleOAuth2(
  credentials.calendar.client_id,
  credentials.calendar.client_secret,
  credentials.calendar.redirect_uris[0],
  fetch
);

const telegramApi = new Telegram(
  credentials.telegram.api_key,
  fetch
);

const main = new Main(authApi, telegramApi, users);

main.start((interval) => console.log(`Application started, checking users every ${interval / 1000} seconds`));
