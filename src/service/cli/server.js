'use strict';

const http = require(`http`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {HttpResponseCode} = require(`../../constants.js`);

const FILENAME = `mocks.json`;
const DEFAULT_PORT = 3000;

const getResponseTemplate = (htmlBody) => (`
  <!DOCTYPE html>
  <html lang="ru">
    <head>
      <title>Личный проект: Типотека</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${htmlBody}
    </body>
  </html>
`);

const getTitlesMarkup = async () => {
  const titles = JSON.parse(await fs.readFile(FILENAME, `utf-8`)).map((offer) => offer.title);
  const markup = `
    <ul>
      ${titles.map((title) => `<li>${title}</li>`).join(``)}
    </ul>
  `;

  return markup;
};

const sendResponse = (response, statusCode, message) => {
  const template = getResponseTemplate(message);

  response.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  response.end(template);
};

const onClientConnect = async (request, response) => {
  const notFoundMessageText = `Упс, ничего не найдено &#x1F622;`;
  const smthWrongMessageText = `Что-то пошло не так...`;

  switch (request.url) {
    case `/`:
      try {
        const markup = await getTitlesMarkup();
        sendResponse(response, HttpResponseCode.OK, markup);
      } catch (error) {
        sendResponse(response, HttpResponseCode.INTERNAL_SERVER_ERROR, smthWrongMessageText);
      }

      break;

    default:
      sendResponse(response, HttpResponseCode.NOT_FOUND, notFoundMessageText);
  }
};

const createServer = (port) => {
  const httpServer = http.createServer(onClientConnect);

  httpServer.listen(port, () => {
    console.info(chalk.blue(`Принимаю подключения на ${port}`));
  });

  httpServer.on(`error`, ({message}) => {
    console.error(chalk.red(`Ошибка: ${message}`));
  });
};

module.exports = {
  name: `--server`,
  run(args) {
    const [port] = args;
    createServer(Number.parseInt(port, 10) || DEFAULT_PORT);
  },
};
