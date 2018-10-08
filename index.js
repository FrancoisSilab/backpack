const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain, Menu } = electron;

let mainWindow;
let addTodoWindow;

app.on('ready', () => {
    console.log('\n' +
        '  ____             _                     _    \n' +
        ' |  _ \\           | |                   | |   \n' +
        ' | |_) | __ _  ___| | ___ __   __ _  ___| | __\n' +
        ' |  _ < / _` |/ __| |/ / \'_ \\ / _` |/ __| |/ /\n' +
        ' | |_) | (_| | (__|   <| |_) | (_| | (__|   < \n' +
        ' |____/ \\__,_|\\___|_|\\_\\ .__/ \\__,_|\\___|_|\\_\\\n' +
        '                       | |                    \n' +
        '                       |_|                    \n');
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL('file:\\'+'\\' + __dirname + '\\index.html');
    mainWindow.on('closed', () => app.quit());
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindows() {
        addTodoWindow = new BrowserWindow({
            width: 600,
            height: 400,
            title: 'Add New Todo'
        });
        addTodoWindow.loadURL('file:\\'+'\\' + __dirname + '\\add-todo.html');
        addTodoWindow.on('close', () => { addTodoWindow = null; }) // Garbage collector
}
function clearTodo() {
    mainWindow.webContents.send('todo:clear');
}

const menuTemplate =[
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Todo',
                click() { createAddWindows(); }
            },
            {
                label: 'Clear Todo',
                click() { clearTodo(); }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];
if(process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'DEVELOPER',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}

ipcMain.on('video:submit', (event, path) => {
    console.log('\n---------------------Vidéo Submited---------------------\n');
    ffmpeg.ffprobe(path, (err, metadata) => {
        console.log('File length is:', metadata.format.duration);
        let duration = metadata.format.duration;
        mainWindow.webContents.send('video:metadata', duration);
    });
});

ipcMain.on('todo:add', (event, todo) => {
    console.log('\n---------------------Todo ajouté---------------------\n');
    mainWindow.webContents.send('todo:data', todo);
    addTodoWindow.close();
});