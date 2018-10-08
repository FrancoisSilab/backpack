const electron = require('electron');
const { ipcRenderer } = electron;

document.querySelector('form').addEventListener('submit', (event)=> {
    event.preventDefault();

    const value = $('#form-horizontal-title')[0].value;
    ipcRenderer.send('todo:add', value);
});