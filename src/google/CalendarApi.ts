import fetch from 'node-fetch';

class CalendarApi {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    getCalendarList() {
        const requestOpts = {
            headers: this.getAuthorizationHeader()
        }

        return fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', requestOpts)
            .then(response => response.json());
    }

    getCalendarEvents(calendarId: string, opts?: string) {
        const requestOpts = {
            headers: this.getAuthorizationHeader()
        }

        return fetch(`https://www.googleapis.com/calendar/v3/calendars/${ calendarId }/events?${ opts }`, requestOpts)
            .then(response => response.json())
            .then(eventsResponse => eventsResponse.items)
    }

    getCalendarEventsForToday(calendarId: string) {
        return this.getCalendarEvents(calendarId, 'timeMin=2020-06-03T00:00:00Z&timeMax=2020-06-03T23:59:59Z&orderBy=startTime&singleEvents=true')
    }

    private getAuthorizationHeader() {
        return { 'Authorization': `Bearer ${ this.accessToken }` };
    }
}

export default CalendarApi;
