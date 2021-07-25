'use strict';

const DEFAULT_COUNT = 1;

const generatePosts = (count) => [];

module.exports = {
  name: `--generate`,
  run(count) {
    generatePosts(Number.parseInt(count, 10) || DEFAULT_COUNT);
  },
}
