const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/chromium-browser',
        defaultViewport: null,
        ignoreDefaultArgs: [
            '--enable-automation'
        ],
        args: [
            '--hide-scrollbars',
            '--no-default-browser-check',
            '--start-fullscreen',
            '--disable-notifications'
        ]
    });
    let config = undefined;
    let pages = await browser.pages();
    let page = pages[0];
    await page.setCacheEnabled(false);
    while (true) {
        try {
            await fetch('{{configurationURL}}')
                .then(x => { return x.text() })
                .then(x => {
                    console.log(x);
                    config = JSON.parse(x)['configuration'];
                });
        } catch {
            console.log("Couldn't fetch configuration");
        }

        if (typeof(config) != "undefined") {
            // download config and navigate to each page specified with the delay specified
            for (domain of config['domains']) {

                // navigate to specified domain
                await page.goto(domain[0]);

                // disable scrollbars
                await page.addStyleTag({content: '::-webkit-scrollbar {display: none;}'});

                // optional css injection
                if (typeof(domain[2]) != "undefined") {
                    try {
                        await page.addStyleTag({url: domain[2]});
                    } catch (e) {
                        console.log("Couldn't fetch styles: " + domain[2]);
                        continue;
                    }
                }

                // wait n amount of seconds between pages
                await sleep(domain[1] * 1000);
            }
        }
    }
})();
