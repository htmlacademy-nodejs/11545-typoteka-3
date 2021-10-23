'use strict';

const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});
const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    logger.info(version);
  }
};
