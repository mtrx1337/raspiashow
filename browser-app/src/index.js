const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve,ms);
    });
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
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
    while (true) {
        await fetch('{{configurationURL}}')
            .then(x => { return x.text() })
            .then(x => {
                console.log(x);
                config = JSON.parse(x)['configuration'];
            });
        if (config !== undefined) {
            // download config and navigate to each page specified with the delay specified
            for (domain of config['domains']) {
                let page = await browser.pages()[0];
                await page.goto(domain);
                // TODO read css links or styles from configuration.json
                await page.addStyleTag({content: '::-webkit-scrollbar {display: none;}'});
                await sleep(config['switch_time']);
            }
        }
    }
})();
