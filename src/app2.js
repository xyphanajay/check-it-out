import path from 'path';
import updateNotifier from 'update-notifier';

import blessed from 'blessed';
import { getRefs, getRemotes } from './utils/refsUtils';


// Checks for available update and returns an instance
import pkg from '../package.json';

const notifier = updateNotifier({ pkg });

if (notifier.update) {
  notifier.notify();
}

export const start = async args => {
  if (args[0] === '-v' || args[0] === '--version') {
    process.stdout.write(pkg.version);

    process.exit(0);
  }

  const screen = () => {
    const screen = blessed.screen({
      autoPadding: true,
      fullUnicode: true,
      smartCSR: true,
      title: 'Check It Out',
    });

    return screen;
  }

  try {
    await getRemotes();
  } catch (error) {
    console.log('error ', error);
  }

  try {
    getRefs(screen());
  } catch (error) {
    console.log('get ref error', error);
  }
};
