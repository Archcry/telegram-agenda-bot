import Transporter from "../Transporter";

class Telegram {
  private apiKey: string;
  private transporter: Transporter;

  private static readonly TELEGRAM_BASE_URL = 'https://api.telegram.org/bot';

  constructor(apiKey: string, transporter: Transporter) {
    this.apiKey = apiKey;
    this.transporter = transporter;
  }

  public sendMessage(chatId: number, body: string, parseMode?: string) {
    parseMode = parseMode || 'HTML';

    return this.sendPostRequest(`${Telegram.TELEGRAM_BASE_URL + this.apiKey}/sendMessage`, {
      chat_id: chatId,
      text: body,
      parse_mode: parseMode
    });
  }

  private sendPostRequest(url: string, requestBody: object) {
    const requestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }

    return this.transporter(url, requestInit)
      .then(response => response.json());
  }
}

export default Telegram;
