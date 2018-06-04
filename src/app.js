import 'babel-polyfill';

import chalk from 'chalk';
import path from 'path';
import updateNotifier from 'update-notifier';

import { getRefs } from './utils/refsUtil';
import { getScreen } from './interface/screen';

import * as pkg from '../package.json';

const notifier = updateNotifier({ pkg });

if (notifier.update) {
  notifier.notify();
}

export const start = args => {
  if (args[0] === '-v' || args[0] === '--version') {
    process.stdout.write(pkg.version);

    process.exit(0);
  }

  getRefs(getScreen(), 'heads');
};
