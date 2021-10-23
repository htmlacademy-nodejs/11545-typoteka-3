'use strict';

const express = require(`express`);
const {HttpResponseCode} = require(`../../constants`);
const createRouter = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;
const logger = getLogger({name: `api`});

const createServer = async (port) => {
  const server = express();
  const apiRouter = await createRouter();

  server.use(express.json());
  server.use(API_PREFIX, apiRouter);
  server.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });

  server.use((req, res) => {
    res.status(HttpResponseCode.NOT_FOUND).send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });

  server.use((err, _req, _res, _next) => {
    logger.error(`An error occurred on processing request: ${err.message}`);
  });

  server.listen(port, () => logger.info(`Принимаю подключения на порт ${port}`));
};

module.exports = {
  name: `--server`,
  run(args) {
    const [port] = args;
    createServer(Number.parseInt(port, 10) || DEFAULT_PORT);
  },
};
