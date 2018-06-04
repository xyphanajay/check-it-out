import blessed from 'blessed';
import chalk from 'chalk';

export const getHelpDialogue = () => {
  const helpDialogue = blessed.table({
    align: 'left',
    border: { type: 'line' },
    data: getHelpText(),
    height: 'shrink',
    hidden: true,
    noCellBorders: true,
    padding: 1,
    right: 0,
    style: {
      border: { fg: '#FFF' },
    },
    bottom: 0,
    width: 'shrink',
  });

  return helpDialogue;
}

const getHelpText = () => {
  const text = [
    [chalk.bold('j/k, down/up'), 'Navigate the list'],
    [chalk.bold('h/l, left/right'), 'Previous/Next remote'],
    [chalk.bold('r'), 'Refresh with a fetch and prune'],
    [chalk.bold('enter'), 'Select highlighted item'],
    [chalk.bold('space'), 'Git log'],
    [chalk.bold('q, C-c, esc'), 'Quit'],
  ];

  return text;
};
