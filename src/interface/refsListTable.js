import blessed from 'blessed';

export const getRefsListTable = () => {
  const refsListTable = blessed.listtable({
    align: 'left',
    left: 0,
    keys: true,
    noCellBorders: true,
    scrollable: true,
    scrollbar: true,
    style: {
      cell: {
        selected: {
          bg: '#FFFFFF',
          fg: '#272727',
        },
      },
      header: {
        fg: '#FFF',
      },
      label: {
        fg: '#FFFFFF',
      },
      scrollbar: {
        bg: '#FFF',
      },
    },
    tags: true,
    top: 0,
    bottom: 1,
    vi: false,
    width: 'shrink',
  });

  refsListTable.key(['left', 'h'], () => {
    currentRemote = getPrevRemote(currentRemote, remoteList);
  });

  refsListTable.key(['right', 'l'], () => {
    currentRemote = getNextRemote(currentRemote, remoteList);
  });

  refsListTable.key('j', () => {
    refsListTable.down();

    screen.render();
  });

  refsListTable.key('k', () => {
    refsListTable.up();

    screen.render();
  });

  refsListTable.key('space', function() {
    const selection = parseSelection(this.items[this.selected].content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    let args = [];

    if (gitRemote) {
      args.push(gitRemote);
    }

    args.push(gitBranch);

    if (args.length > 1) {
      args = args.join('/');
    }

    screen.spawn('git', ['log', args, '--color=always']);
  });

  refsListTable.on('select', selectedLine => {
    const selection = parseSelection(selectedLine.content);

    const gitBranch = selection[2];
    const gitRemote = selection[1];

    // If selection is a remote, prompt if new branch is to be created.
    return doCheckoutBranch(gitBranch, gitRemote)
      .then(output => {
        screen.destroy();

        process.stdout.write(`Checked out to ${chalk.bold(gitBranch)}\n`);

        process.exit(0);
      })
      .catch(error => {
        screen.destroy();

        readError(error, gitBranch, 'checkout');
      });
  });

  return refsListTable;
};

const parseSelection = selectedLine => {
  const selection = selectedLine.split(/\s*\s/).map(column => {
    return column === 'local' ? '' : column;
  });

  return selection;
};

/**
 * Cycle to previous remote
 *
 * @param  currentRemote {String} Current displayed remote
 * @param  remoteList {Array} Unique remotes for current project
 * @return {String}
 */
const getPrevRemote = (currentRemote, remoteList) => {
  let currIndex = remoteList.indexOf(currentRemote);

  if (currIndex > 0) {
    currIndex -= 1;
  }

  currentRemote = remoteList[currIndex];

  getRefs(getScreen(), currentRemote);

  return currentRemote;
};

/**
 * Cycle to next remote
 *
 * @param  currentRemote {String} Current displayed remote
 * @param  remoteList {Array} Unique remotes for current project
 * @return {String}
 */
const getNextRemote = (currentRemote, remoteList) => {
  let currIndex = remoteList.indexOf(currentRemote);

  if (currIndex < remoteList.length - 1) {
    currIndex += 1;
  }

  currentRemote = remoteList[currIndex];

  getRefs(getScreen(), currentRemote);

  return currentRemote;
};
