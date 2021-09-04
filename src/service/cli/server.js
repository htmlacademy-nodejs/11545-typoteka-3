'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {HttpResponseCode} = require(`../../constants.js`);

const FILENAME = `mocks.json`;
const DEFAULT_PORT = 3000;

const createServer = (port) => {
  const server = express();

  server.use(express.json());

  server.get(`/posts`, async (req, res) => {
    try {
      const posts = JSON.parse(await fs.readFile(FILENAME, `utf-8`));
      res.json(posts);
    } catch (error) {
      res.send([]);
    }
  });

  server.use((req, res) => {
    res.status(HttpResponseCode.NOT_FOUND).send(`Not found`);
  });

  server.listen(port, () => console.info(chalk.blue(`Принимаю подключения на порт ${port}`)));
};

module.exports = {
  name: `--server`,
  run(args) {
    const [port] = args;
    createServer(Number.parseInt(port, 10) || DEFAULT_PORT);
  },
};
