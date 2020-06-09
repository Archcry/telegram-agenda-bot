import { ParsedUrlQueryInput, stringify } from 'querystring';
import Transporter from '../Transporter';

class CalendarApi {
  private accessToken: string;
  private transporter: Transporter;

  constructor(accessToken: string, transporter: Transporter) {
    this.accessToken = accessToken;
    this.transporter = transporter
  }

  private static readonly CALENDAR_BASE_URL = 'https://www.googleapis.com/calendar/v3';

  public getEvents(timeMin: string, timeMax: string) {
    const query = {
      timeMin: timeMin,
      timeMax: timeMax,
      orderBy: 'startTime',
      singleEvents: true
    };

    return this.getCalendarIds()
      .then(calendarIds => calendarIds.map(calendarId => this.getEventsForCalendarId(calendarId, query)))
      .then(eventsPromises => Promise.all(eventsPromises))
      .then(eventsResponses => eventsResponses.flatMap(events => events));
  }

  private getCalendarIds(): Promise<string[]> {
    return this.sendGetRequest(`${CalendarApi.CALENDAR_BASE_URL}/users/me/calendarList`)
      .then(calendarResponse => calendarResponse.items.map((calendar: any) => calendar.id));
  }

  private getEventsForCalendarId(calendarId: string, opts: ParsedUrlQueryInput) {
    return this.sendGetRequest(`${CalendarApi.CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events?${stringify(opts)}`)
      .then(eventsResponse => eventsResponse.items)
  }

  private sendGetRequest(url: string) {
    const requestInit = {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }
    }

    return this.transporter(url, requestInit)
      .then(response => response.json())
  }
}

export default CalendarApi;
