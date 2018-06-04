import blessed from 'blessed';

import { getRefsListTable } from './refsListTable';
import { getStatusBar } from './statusBar';
import { getHelpDialogue } from './helpDialogue';
import { getRefs } from '../utils/refsUtil';

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
  const refsListTable = getRefsListTable(currentRemote);

  const toggleHelp = () => {
    helpDialogue.toggle();
    screen.render();
  };

  screen.key('?', toggleHelp);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.key('r', getRefs(screen, currentRemote));

  screen.append(refsListTable);
  screen.append(getStatusBar());
  screen.append(helpDialogue);

  refsListTable.setFront();

  refsListTable.focus();

  return screen;
};

const toggleHelp = () => {
  helpDialogue.toggle();
  screen.render();
};
