const { spawn } = require('child_process');
const { addRef, addRemote, clearRefs } = require('../redux/actions');
const { store } = require('../redux/store');

let gitRefsProcess;
let gitRemotesProcess;

const getRemotes = async () => {
  gitRemotesProcess = spawn('git', ['remote']);

  gitRemotesProcess.stdout.setEncoding('utf8');
  gitRemotesProcess.stdout.on('data', (data) => {
    store.dispatch(addRemote(data.trim().split('\n')));
  });


  gitRemotesProcess.on('close', (code) => {
    if (code > 0) {
      screen.destroy();

      process.stderr.write(
        'CIO encountered an error calling "git remote":\n\n');
      process.stderr.write(errorString);

      process.exit(code);
    }
  });

};

const getRefs = (screen) => {
  if (gitRefsProcess) {
    gitRefsProcess.stdout.removeAllListeners();
    gitRefsProcess.stderr.removeAllListeners();
    gitRefsProcess.removeAllListeners();

    gitRefsProcess.kill();
  }

  const state = store.getState();

  const { remotes = ['local'] } = state;

  console.log('remotes in get refs', remotes);

  store.dispatch(clearRefs());

  remotes.forEach(remote => {
    gitRefsProcess = spawn(
      'git', [
        'for-each-ref',
        '--shell',
        '--sort=-committerdate',
        '--format=%(refname)',
        `refs/${remote}`,
        // '--count=500', // Commented out to test as we build redux. If we don't need this, awesome.
      ]);

    let errorString = '';

    gitRefsProcess.stdout.setEncoding('utf8');
    gitRefsProcess.stdout.on('data', (data) => {
      store.dispatch(addRef(data.trim().split('\n')));
    });

    gitRefsProcess.stderr.on('data', (data) => errorString += data);

    gitRefsProcess.on('close', (code) => {
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
  });
};

module.exports = {
  getRefs,
  getRemotes
}
