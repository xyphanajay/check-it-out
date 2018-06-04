import { spawn } from 'child_process';

import { getRefsListTable } from '../interface/refsListTable';
import { getCurrentBranch } from './git';

const tableHeader = ['', 'Remote', 'Branch Name'];

let gitRefsProcess;
let gitRemoteProcess;
let refsList = [];

export const getRemotes = () => {
  if (gitRemoteProcess) {
    gitRemoteProcess.stdout.removeAllListeners();
    gitRemoteProcess.stderr.removeAllListeners();
    gitRemoteProcess.removeAllListeners();

    gitRemoteProcess.kill();
  }

  return new Promise((resolve, reject) => {
    let dataString = '';
    let errorString = '';

    const gitRemoteProcess = spawn('git', ['remote']);

    gitRemoteProcess.stdout.setEncoding('utf8');
    gitRemoteProcess.stderr.setEncoding('utf8');

    gitRemoteProcess.stdout.on('data', data => (dataString += data));
    gitRemoteProcess.stderr.on('data', data => (errorString += data));

    gitRemoteProcess.on('close', code => {
      if (code === 0) {
        resolve(dataString.toString().trim().split('\n'));
      } else {
        reject(errorString.toString());
      }
    });
  });
};

export const getRefs = async (screen, currentRemote = 'heads') => {
  if (gitRefsProcess) {
    gitRefsProcess.stdout.removeAllListeners();
    gitRefsProcess.stderr.removeAllListeners();
    gitRefsProcess.removeAllListeners();

    gitRefsProcess.kill();
  }

  refsList = [];
  screen.render();

  const remotesArray = await getRemotes();

  gitRefsProcess = spawn('git', [
    'for-each-ref',
    '--sort=-committerdate',
    '--format=%(refname)',
    `refs/${currentRemote}`,
  ]);

  let errorString = '';
  let dataString = '';

  gitRefsProcess.stdout.setEncoding('utf8');
  gitRefsProcess.stdout.on('data', data => {
    dataString += data;
    addRefs(data.trim().split('\n'), currentRemote, remotesArray);
  });

  gitRefsProcess.stderr.on('data', data => (errorString += data));

  gitRefsProcess.on('close', code => {
    if (code > 0) {
      screen.destroy();

      process.stderr.write(
        'CIO encountered an error with the call to "git for-each-ref":\n\n',
      );
      process.stderr.write(errorString);

      process.exit(code);
    } else {
      screen.render();
    }
  });
};

const addRefs = async (refs, currentRemote, remotesArray) => {
  const refsListTable = getRefsListTable(currentRemote, remotesArray);

  let newRefs = [];
  const currentBranch = await getCurrentBranch();

  refs.forEach(item => {
    let retVal = item.split('/');
    let retArr = [];

    retVal.shift();

    const remote = retVal[0];

    retVal.shift();

    const branch = retVal.join('/').trim();

    if (branch === currentBranch.trim()) {
      retArr.push('*');
    } else {
      retArr.push(' ');
    }

    retArr.push(remote);
    retArr.push(branch);

    newRefs.push(retArr);
  });

  refsList = [...refsList, ...newRefs];

  refsListTable.setData(tableHeader, ...refsList);

  refsListTable.setFront();
  refsListTable.screen.render();
};
