# puppeteer-bookmarks

### 介绍 <br>

`puppeteer-bookmarks` 是一个能将多个 `chrome` 书签页整合成一个书签页的工具 <br>
本工具使用 `express` 做静态服务器用, 将所有需要整合的书签页放入 `src` -> `express` -> `bookmarks` 中 <br>
使用 `puppeteer` 抓取页面上的书签数据, 通过 `ejs` 模板生成整合所有书签的书签页

### 使用 <br>

`npm install` 安装项目依赖 <br>
`npm run start-express` 启动服务器 <br>
`npm run start-puppeteer` 开始抓取数据

##### 生成的 html 书签页可直接导入 `chrome`
