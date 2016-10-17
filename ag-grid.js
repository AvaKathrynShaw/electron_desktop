var agGrid = require('ag-grid');
//require('ag-grid/dist/styles/theme-fresh.css');
//require('./node_modules/ag-grid/dist/styles/ag-grid.css');

// if you are not using ag-Grid Enterprise, then leave the following require out
//require('ag-grid-enterprise');

var eGridContainer = document.querySelector('#gridContainer');

var gridOptions = {
    columnDefs: [
        {headerName: 'Record', field: 'recordNumber'},
        {headerName: 'Value 1', field: 'value1'},
        {headerName: 'Value 2', field: 'value2'}
    ],
    rowData: [],
    onGridReady: function(params) {
        params.api.sizeColumnsToFit();
    }
};

for (var i = 0; i<1000; i++) {
    gridOptions.rowData.push({
        recordNumber: i,
        value1: Math.floor(Math.random() * 10000),
        value2: Math.floor(Math.random() * 10000)
    });
}

new agGrid.Grid(eGridContainer, gridOptions);
