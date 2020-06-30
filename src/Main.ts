import fetch from 'node-fetch';
import moment from 'moment-timezone';

import GoogleOAuth2 from './google/GoogleOAuth2';
import CalendarApi from './google/CalendarApi';
import Telegram from './telegram/Telegram';

import * as os from 'os';

class Main {
  private authApi: GoogleOAuth2;
  private telegramApi: Telegram;
  private users: any[];

  private static readonly INTERVAL = 60000;

  constructor(authApi: GoogleOAuth2, telegramApi: Telegram, users: any[]) {
    this.authApi = authApi;
    this.telegramApi = telegramApi

    this.users = users;
  }

  public start(callback?: (interval: number) => void) {
    setInterval(this.checkUsers.bind(this), Main.INTERVAL);

    if (callback) {
      callback(Main.INTERVAL);
    }
  }

  private checkUsers() {
    this.users.forEach((user: any, index: number) => {
      const now = moment().tz(user.settings.timezone).format('H:mm');

      if(user.settings.send_notification_at === now) {
        console.log(`Sending events to user with id ${index}`);

        this.sendCalendarEvents(user);
      }
    });
  }

  private async sendCalendarEvents(user: any) {
    try {
      const events = await this.getCalendarEvents(user);

      if(events.length > 0) {
        const message = events.reduce(this.calendarEventReducer.bind(this), '')

        await this.telegramApi.sendMessage(user.telegram_chat_id, message);
      } else {
        console.info('No events found');
      }
    } catch (err) {
      console.error(err);
    }
  }

  private getCalendarEvents(user: any) {
    const now = moment().tz(user.settings.timezone);

    const start = now.startOf('day').toISOString();
    const end = now.endOf('day').toISOString();

    return this.getAccessToken(user.refresh_token)
      .then(calendarApi => calendarApi.getEvents(start, end));
  }

  private getAccessToken(refreshToken: string) {
    return this.authApi.refreshToken(refreshToken)
      .then(data => data.access_token)
      .then(accessToken => new CalendarApi(accessToken, fetch))
  }

  private calendarEventReducer(accumulator: string, event: any) {
    let body = `<b>${event.summary} ${os.EOL}</b>`;

    body += `<b>Start:</b> ${this.parseMoment(event.start)} ${os.EOL}`;
    body += `<b>End:</b> ${this.parseMoment(event.end)} ${os.EOL}`;

    if (event.description) {
      body += `<b>Description:</b> ${event.description} ${os.EOL}`;
    }

    body += os.EOL

    return accumulator + body;
  }

  private parseMoment(obj: any) {
    if (obj.dateTime) {
      let dateTimeMoment = moment(obj.dateTime);

      if (obj.timeZone) {
        dateTimeMoment = dateTimeMoment.tz(obj.timeZone);
      }

      return dateTimeMoment.format('D MMM H:mm:ss');
    }

    return moment(obj.date).format('D MMM');
  }
}

export default Main;
