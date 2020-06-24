# SETUP

1. Clone repository
2. Execute `npm install` in `./telegram-agenda-bot/`
3. Execute `tsc` in in `./telegram-agenda-bot/`
4. Create and fill out `./telegram-agenda-bot/credentials.json`

```
{
  "telegram": {
    "api_key": ""
  },
  "calendar": {
    "client_id": "",
    "client_secret": "",
    "redirect_uris": []
  }
}
```

5. Create and fill out `./telegram-agenda-bot/users.json`

```
{
  "settings": {
    "timezone": "",
    "send_notification_at": ""
  },
  "telegram_chat_id": "",
  "refresh_token": ""
}
```

6. Execute `npm start` in `./telegram-agenda-bot`
