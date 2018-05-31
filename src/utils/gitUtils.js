/**
 * Execute git command with passed arguments.
 * <args> is expected to be an array of strings.
 * Example: ['fetch', '-pv']
 */
function execGit(args) {
  return new Promise((resolve, reject) => {
    let dataString = '';
    let errorString = '';

    const gitResponse = spawn('git', args);

    gitResponse.stdout.setEncoding('utf8');
    gitResponse.stderr.setEncoding('utf8');

    gitResponse.stdout.on('data', data => (dataString += data));
    gitResponse.stderr.on('data', data => (errorString += data));

    gitResponse.on('close', code => {
      if (code === 0) {
        resolve(dataString.toString());
      } else {
        reject(errorString.toString());
      }
    });
  });
}

/**
 * Return name of current branch.
 *
 * Returns a promise that resolves to the current branch name.
 */
export function getCurrentBranch() {
  const args = ['rev-parse', '--abbrev-ref', 'HEAD'];

  return execGit(args);
}
