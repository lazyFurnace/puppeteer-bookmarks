const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');

(async () => {
    const browser = await (puppeteer.launch({
        // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        // 设置超时时间
        timeout: 15000,
        // 如果是访问https页面 此属性会忽略https错误
        ignoreHTTPSErrors: true,
        // 打开开发者工具, 当此值为true时, headless总为false
        devtools: false,
        // 关闭headless模式, 不会打开浏览器
        headless: true
    }));

    /**
     * 使用 node 打开一个浏览器,其中操作全部为异步操作,使用 promise 的语法糖 async 和 await
     * 打开一个空白页 -> 跳转至 localhost -> 获取所有书签页面
     */
    const page = await browser.newPage();
    await page.goto('http://localhost');
    const bookmark = await page.$$eval('a', node => node.map(item => item.href));

    // jsonData 用于记录所有书签的数据
    let jsonData = [];

    /**
     * 遍历所有书签页, 调用 page.goto(url) 访问该书签页
     * 获取该书签页所有的书签,生成一个数组
     * 将这个数组放入 bookmarkData 中
     */
    for (let i = 0; i < bookmark.length; i++) {
        const item = bookmark[i];
        await page.goto(item);
        const bookmarkData = await page.$$eval('a', node => node.map(item => {
            return {
                href: item.href,
                add_date: item.getAttribute('add_date'),
                icon: item.getAttribute('icon'),
                text: item.textContent
            }
        }))
        jsonData.push(...bookmarkData);
    }

    // 过滤重复的书签
    const filterArray = [];
    jsonData = jsonData.filter(item => {
        if (filterArray.indexOf(item.href) === -1) {
            filterArray.push(item.href);
            return true;
        } else {
            return false;
        }
    })

    // 调用 fs.writeFile() 生成一个 json 文件
    fs.writeFile(__dirname + '/bookmark.json', JSON.stringify(jsonData, null, 4), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('文件书签 json 创建成功!');
        }
    });

    // 调用 ejs.renderFile() 然后调用 fs.writeFile() 生成一个整个所有书签的书签页
    ejs.renderFile(__dirname + '/bookmark.ejs', { json: jsonData }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            fs.writeFile(__dirname + '/bookmark.html', data, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('文件书签 html 创建成功!');
                }
            })
        }
    });

    console.log('合并书签 html 生成成功!')
    await browser.close();

})();