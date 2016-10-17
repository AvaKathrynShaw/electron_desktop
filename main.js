const {remote} = require('electron');
const {Menu, MenuItem} = remote;
const {ipcRenderer} = require('electron');

const menu = Menu.buildFromTemplate([
  {
      label: 'Charts',
        submenu: [
          {
            label: 'Standard Chart',
            click: function () {
              ipcRenderer.send('show-prefs')
            }
          },

          {
            label: 'Quickstart',
            click: function () {
              ipcRenderer.send('show-quickstart')
            }
          },

          {
            label: 'Basic Chart',
            click: function () {
              ipcRenderer.send('show-basic')
            }
          },

          {
            label: 'Advanced Chart',
            click: function () {
              ipcRenderer.send('show-advanced')
            }
          },

          {
            label: 'Phone',
            click: function () {
              ipcRenderer.send('show-phone')
            }
          },

          {
            label: 'ChartIQ (bug)',
            click: function () {
              ipcRenderer.send('show-chartiq')
            }
          },
        ],
  },

  {
      label: 'Quote Grid',
        submenu: [
          {
            label: 'Basic',
            click: function () {
              ipcRenderer.send('show-agGrid')
            }
          },
        ],
  }

]);

Menu.setApplicationMenu(menu);
