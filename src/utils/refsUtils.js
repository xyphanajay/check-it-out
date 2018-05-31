import { spawn } = require('child_process');
//import { addCommits, clearLog, updateStatus } = require('../redux/action-creators');
import { store } = require('../redux/store');

let gitRefsProcess;

export const getRefs = (screen) => {
  if (gitRefsProcess) {
    gitRefsProcess.stdout.removeAllListeners();
    gitRefsProcess.stderr.removeAllListeners();
    gitRefsProcess.removeAllListeners();

    gitRefsProcess.kill();
  }

  store.dispatch(clearRefs());

  gitRefsProcess = spawn(
    'git', [
      'for-each-ref',
      '--sort=-committerdate',
      '--format=%(refname)',
      // '--count=500', // Commented out to test as we build redux. If we don't need this, awesome.
    ]);

  let errorString = '';

  gitRefsProcess.stdout.setEncoding('utf8');
  gitRefsProcess.stdout.on('data', (data: string) => {
    store.dispatch(addRefs(data.trim().split('\n')));
  });

  gitRefsProcess.stderr.on('data', (data: string) => errorString += data);

  gitRefsProcess.on('close', (code: number) => {
    if (code > 0) {
      screen.destroy();

      process.stderr.write(
        'CIO encountered an error calling "git for-each-ref":\n\n');
      process.stderr.write(errorString);

      process.exit(code);
    } else {
      // store.dispatch(updateStatus(Status.LOG_COMPLETED));
    }
  });

  screen.render();
};
