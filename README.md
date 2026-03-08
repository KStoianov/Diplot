# Doplot Project

Уеб приложение за туристическа агенция с React клиент и Node.js/Express сървър.

## Технологии
- **Client:** React (CRA), Axios, React Router, Tailwind
- **Server:** Node.js, Express, Mongoose, MongoDB
- **AI:** Ollama (`gemma2:9b`)

## Изисквания
- Node.js 18+
- MongoDB (локално на `mongodb://localhost:27017`)
- Ollama (локално на `http://localhost:11434`) + модел `gemma2:9b`

## Инсталация
От root папката на проекта:

```bash
cd client
npm install

cd ../server
npm install
```

## Стартиране
### 1) Стартирай MongoDB
Увери се, че MongoDB работи локално.

### 2) Стартирай сървъра
```bash
cd server
npm start
```
Сървърът тръгва на `http://localhost:5000`.

### 3) Стартирай клиента
В нов терминал:
```bash
cd client
npm start
```
Клиентът тръгва на `http://localhost:3000`.

## Зареждане на демо данни (по избор)
В `server` папката:

```bash
node seed_full.js
```
Това зарежда хотелите в базата `diplot_travel_agency_db`.

## Полезни команди
### Server
```bash
npm start     # production run
npm run dev   # nodemon
```

### Client
```bash
npm start
npm test
npm run build
```

## Често срещани проблеми
- **`node server` дава грешка** → използвай `npm start` или `node server.js` в `server`.
- **Грешка за MongoDB connection** → стартирай MongoDB локално.
- **Грешка от AI chat** → стартирай Ollama и дръпни модела:
  ```bash
  ollama pull gemma2:9b
  ```
- **CORS / API грешки в клиента** → увери се, че сървърът е стартиран на порт `5000`.

## Структура
- `client/` — React приложение
- `server/` — API, модели и seed скриптове
