const electron = require('electron');
const { ipcRenderer } = electron;
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const { path } = document.querySelector('input').files[0];
    ipcRenderer.send('video:submit', path);
});
ipcRenderer.on('video:metadata', (event, duration) => {
    document.querySelector('#modal-example div p').innerHTML = 'La vidéo possède une durée de : '+duration+' secondes';
    UIkit.modal('#modal-example').show();
});
ipcRenderer.on('todo:data', (event, todo) => {
    $('ul.uk-list').append('<li><label><input class="uk-checkbox uk-margin-medium-right" type="checkbox" checked>'+todo+'</label></li>')
});
ipcRenderer.on('todo:clear', (event, todo) => {
    $('ul.uk-list').empty();
});