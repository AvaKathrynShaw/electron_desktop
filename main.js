const {remote} = require('electron');
const {Menu, MenuItem} = remote;
const {ipcRenderer} = require('electron');

const menu = Menu.buildFromTemplate([
  {
      label: 'Electron',
        submenu: [
          {
            label: 'Prefs',
            click: function () {
              ipcRenderer.send('show-prefs')
            }
          }
        ]
  }

]);

Menu.setApplicationMenu(menu);
