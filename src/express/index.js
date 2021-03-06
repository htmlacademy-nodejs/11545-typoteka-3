'use strict';

const path = require(`path`);
const express = require(`express`);
const router = require(`./routes`);
const {HttpResponseCode} = require(`../constants.js`);
const {getLogger} = require(`../lib/logger`);
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;
const logger = getLogger({name: `api`});

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(router);

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use((req, res) => {
  res.status(HttpResponseCode.NOT_FOUND).render(`errors/404`);
});
app.use((err, req, res) => {
  logger.error(`Ошибка: ${err}`);
  res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(DEFAULT_PORT, () => logger.log(`Сервер запущен на порту ${DEFAULT_PORT}`));
