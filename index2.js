const blessed = require('blessed');
const getRefs = require('./src/utilsno/refsUtils.js');

function screen() {
  const screen = blessed.screen({
    autoPadding: true,
    fullUnicode: true,
    smartCSR: true,
    title: 'Check It Out',
  });

  return screen;
}


getRefs(screen);
