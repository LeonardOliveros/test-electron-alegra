const {app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')// this is required to check if the app is running in development mode.
const {appUpdater} = require('./autoUpdater')
const url = require('url')
const path = require('path')

/* Handling squirrel.windows events on windows
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (require('electron-squirrel-startup')) {
  app.quit()
}

let win


// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
  return process.platform === 'darwin' || process.platform === 'win32'
}

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(url.format ({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

app.on('ready', () => {
  const checkOS = isWindowsOrmacOS()
  console.log(checkOS)
  if (checkOS && !isDev) {
    // Initate auto-updates on macOs and windows
    appUpdater()
  };
  createWindow()
})
