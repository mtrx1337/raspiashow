const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
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

        if (typeof(config) != "undefined") {
            // download config and navigate to each page specified with the delay specified
            let pages = await browser.pages();
            for (domain of config['domains']) {

                // navigate to specified domain
                await pages[0].goto(domain[0]);

                // disable scrollbars
                await pages[0].addStyleTag({content: '::-webkit-scrollbar {display: none;}'});

                // optional css injection
                if (typeof(domain[2]) != "undefined") {
                    try {
                        await pages[0].addStyleTag({url: domain[2]});
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
