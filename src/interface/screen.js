import blessed from 'blessed';

import { getRefsListTable } from './refsListTable';
import { getStatusBar } from './statusBar';
import { getHelpDialogue } from './helpDialogue';

export const getScreen = (currentRemote) => {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
  });

  process.on('SIGWINCH', () => {
    screen.emit('resize');
  });

  const helpDialogue = getHelpDialogue();
  const refsListTable = getRefsListTable();

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  // screen.key('r', () => {
  //   doFetchBranches()
  //     .then(
  //       () => {
  //         branchTable.clearItems();

  //         refreshTable(currentRemote);
  //       },
  //       err => {
  //         screen.destroy();

  //         readError(err, currentRemote, 'fetch');
  //       },
  //     )
  //     .catch(error => {
  //       screen.destroy();

  //       readError(error, currentRemote, 'fetch');
  //     });
  // });

  screen.append(refsListTable);
  screen.append(getStatusBar());
  screen.append(helpDialogue);

  refsListTable.focus();

  return screen;
};

const toggleHelp = () => {
  helpDialogue.toggle();
  screen.render();
};
