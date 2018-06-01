#!/usr/bin/env node

require("babel-polyfill");

const app2 = require('./lib/app2');

app2.start(process.argv.slice(2));
