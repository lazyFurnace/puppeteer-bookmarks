const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await (puppeteer.launch({
        // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        //设置超时时间
        timeout: 15000,
        //如果是访问https页面 此属性会忽略https错误
        ignoreHTTPSErrors: true,
        // 打开开发者工具, 当此值为true时, headless总为false
        devtools: false,
        // 关闭headless模式, 不会打开浏览器
        headless: false
    }));

    // 打开一个空白页
    const page = await browser.newPage();

    // 跳转至 localhost
    await page.goto('http://localhost');

    // 获取所有书签页面
    const bookmark = await page.$$eval('a', node => node.map(item => item.href));

    let jsonData = [];

    // 遍历所有书签页, 生成一个包含所有书签项的数组
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

    const filterArray = [];

    // 过滤重复的书签
    jsonData = jsonData.filter(item => {
        if (filterArray.indexOf(item.href) === -1) {
            filterArray.push(item.href);
            return true;
        } else {
            return false;
        }
    })

    // 生成一个 json 文件
    fs.writeFile(__dirname + '/bookmark.json', JSON.stringify(jsonData, null, 4), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('文件创建成功');
        }
    });

})();