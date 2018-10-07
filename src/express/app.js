const http = require('http');
const fs = require('fs');
const express = require('express');

// 书签页的 url
const bookmarks = __dirname + '/bookmarks';

let bookmarksList;

// 读取书签页文件下的所有书签文件
fs.readdir(bookmarks, (err, files) => {
    if (err) {
        console.error(err);
    } else {
        bookmarksList = files;
    }
});

const app = express();

// 书签静态服务器
app.use('/bookmarks', express.static(bookmarks));

// 首页的数据
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
