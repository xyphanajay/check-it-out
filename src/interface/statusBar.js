import blessed from 'blessed';

export const getStatusBar = () => {
  const statusBar = blessed.box({
    border: false,
    bottom: 0,
    height: 1,
    width: '100%',
  });

  statusBar.append(getStatusBarText());
  statusBar.append(getStatusHelpText());

  return statusBar;
}

const getStatusHelpText = () => {
  const statusHelpText = blessed.text({
    content: 'Press "?" to show/hide help.',
    right: 0,
  });

  return statusHelpText;
}

const getStatusBarText = () => {
  const statusBarText = blessed.text({
    content: '',
    left: 0,
    bottom: 0,
  });

  return statusBarText;
}
