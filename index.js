const electron = require('electron');
const {app} = electron;

const {ipcMain} = require('electron')

const {BrowserWindow} = require('electron')

app.on('ready', function(){
  let win = new BrowserWindow({width: 800, height: 600})
  win.on('closed', () => {
  win = null
});

win.loadURL('file://'+__dirname + '/index.html');
win.openDevTools();

var prefsWindow = new BrowserWindow({
  width: 400,
  height: 400,
  show: false,
  frame: false,
});

prefsWindow.loadURL('file://'+__dirname + '/prefs.html');

ipcMain.on('show-prefs', function (){
  prefsWindow.show();
})
ipcMain.on('hide-prefs', function (){
  prefsWindow.hide();
})

});
