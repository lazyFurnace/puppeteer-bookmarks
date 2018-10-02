const puppeteer = require('puppeteer');
const URL = 'https://coding.napolux.com';

puppeteer.launch({
    headless: false,
    // args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: 320, height: 600 })
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1')

    await page.goto(URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('body.blog');
    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

    const result = await page.evaluate(() => {
        try {
            var data = [];
            $('h3.loop__post-title').each(function () {
                const url = $(this).find('a').attr('href');
                const title = $(this).find('a').attr('title')
                data.push({
                    'title': title,
                    'url': url
                });
            });
            return data; // 返回数组
        } catch (err) {
            reject(err.toString());
        }
    });

    // 关闭浏览器
    await browser.close();

    // 记录播客标题
    for (var i = 0; i < result.length; i++) {
        console.log('Post: ' + result[i].title + ' URL: ' + result[i].url);
    }
    process.exit();
}).catch(function (error) {
    console.log(error);
    console.error('No way Paco!');
    process.exit();
});
