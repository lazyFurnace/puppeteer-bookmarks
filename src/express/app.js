const http = require('http');
const fs = require('fs');
const express = require('express');

const bookmarks = __dirname + '/bookmarks';

let bookmarksList;

fs.readdir(bookmarks, (err, files) => {
    if (err) {
        console.error(err);
    } else {
        bookmarksList = files;
    }
});

const app = express();

app.use('/bookmarks', express.static(bookmarks));

app.get('/', (req, res) => {
    const indexResult = `
        <ul>
            ${
                bookmarksList.map(item => {
                    return `<li><a href='/bookmarks/${item}'>${item.split('.')[0]}</a></li>`
                }).join('')
            }
        </ul>
    `;
    res.send(indexResult);
})

// 创建服务端
http.createServer(app).listen('80', () => {
    console.log('启动服务器完成');
});
