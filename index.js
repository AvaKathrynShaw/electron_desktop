const electron = require('electron');
const {app} = electron;
const {ipcMain} = require('electron')
const {BrowserWindow} = require('electron')


//loads main window
app.on('ready', function(){
  let win = new BrowserWindow({width: 800, height: 600})
  win.on('closed', () => {
  win = null
});

win.loadURL('file://'+__dirname + '/index.html');
win.openDevTools();

//loads standard chart
var prefsWindow = new BrowserWindow({
  width: 1000,
  height: 800,
  show: false,
  frame: true,
});

prefsWindow.loadURL('file://'+__dirname + '/stx-standard.html');

ipcMain.on('show-prefs', function (){
  prefsWindow.show();
})
ipcMain.on('hide-prefs', function (){
  prefsWindow.hide();
})

//loads quickstart chart
var quickstart = new BrowserWindow({
  width: 1000,
  height: 800,
  show: false,
  frame: true,
});

quickstart.loadURL('file://'+__dirname + '/stx-quickstart.html');

ipcMain.on('show-quickstart', function (){
  quickstart.show();
})
ipcMain.on('hide-quickstart', function (){
  quickstart.hide();
})


//loads Basic Chart
var basic = new BrowserWindow({
  width: 1000,
  height: 800,
  show: false,
  frame: true,
});

basic.loadURL('file://'+__dirname + '/stx-basic.html');

ipcMain.on('show-basic', function (){
  basic.show();
})
ipcMain.on('hide-basic', function (){
  basic.hide();
})

//loads advanced chart
var advanced = new BrowserWindow({
  width: 1000,
  height: 800,
  show: false,
  frame: true,
});

advanced.loadURL('file://'+__dirname + '/stx-advanced.html');

ipcMain.on('show-advanced', function (){
  advanced.show();
})
ipcMain.on('hide-advanced', function (){
  advanced.hide();
})

//loads nothing this is broken ...
var chartiq = new BrowserWindow({
  width: 1000,
  height: 800,
  show: false,
  frame: true,
});

chartiq.loadURL('file://'+__dirname + '/chartiq.html');

ipcMain.on('show-chartiq', function (){
  chartiq.show();
})
ipcMain.on('hide-chartiq', function (){
  chatiq.hide();
})


//loads "phone" chart partially, does not include the bottom buttons
var phone = new BrowserWindow({
  width: 1000,
  height: 800,
  show: false,
  frame: true,
});

phone.loadURL('file://'+__dirname + '/stx-phone.html');

ipcMain.on('show-phone', function (){
  phone.show();
})
ipcMain.on('hide-phone', function (){
  phone.hide();
})

//loads nothing this is broken ...
var agGrid = new BrowserWindow({
  width: 1000,
  height: 800,
  show: false,
  frame: true,
});

agGrid.loadURL('file://'+__dirname + '/ag-grid.html');

ipcMain.on('show-agGrid', function (){
  agGrid.show();
  agGrid.openDevTools();
})
ipcMain.on('hide-agGrid', function (){
  agGrid.hide();
})

});
