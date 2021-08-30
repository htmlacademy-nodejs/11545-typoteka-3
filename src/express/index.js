'use strict';

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);
const router = require(`./routes`);
const {HttpResponseCode} = require(`../constants.js`);
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(router);

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use((req, res) => {
  res.status(HttpResponseCode.NOT_FOUND).render(`errors/404`);
});
app.use((err, req, res) => {
  console.error(chalk.red(`Ошибка: ${err}`));
  res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(DEFAULT_PORT, () => console.log(chalk.blue(`Сервер запущен на порту ${DEFAULT_PORT}`)));
