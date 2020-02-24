const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    let browser = undefined;
    let config = undefined;

    let config_url = process.env.RASPIASHOW_CONFIG_URL;
    if (config_url === undefined) {
        console.log("You need to set a configuration file URL in the RASPIASHOW_CONFIG_URL environment variable.");
        process.exit();
    }

    try {
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
    } catch (e) {
        console.log("Couldn't start browser.");
        process.exit();
    }

    let pages = await browser.pages();
    let page = pages[0];
    await page.setCacheEnabled(false);
    while (true) {
        try {
            await fetch(config_url)
                .then(x => { return x.text() })
                .then(x => {
                    config = JSON.parse(x)['configuration'];
                });
        } catch {
            console.log("Couldn't fetch configuration");
            await sleep(1000);
        }

        if (typeof(config) !== "undefined") {
            // download config and navigate to each page specified with the delay specified
            for (domain of config["domains"]) {
                // navigate to specified domain
                console.log("Navigating to: " + domain["url"]);
                await page.goto(domain["url"]);

                // disable scrollbars
                await page.addStyleTag({content: '::-webkit-scrollbar {display: none;}'});

                // optional css injection
                if (typeof(domain["css"]) != "undefined" && domain["js"] !== "") {
                    try {
                        await page.addStyleTag({url: domain["css"]});
                    } catch (e) {
                        console.log("Couldn't fetch styles: " + domain["css"]);
                        continue;
                    }
                }

                // optional css injection
                if (typeof(domain["js"]) != "undefined" && domain["js"] !== "") {
                    try {
                        await page.addScriptTag({url: domain["js"]});
                    } catch (e) {
                        console.log("Couldn't fetch script: " + domain["js"]);
                        continue;
                    }
                }

                // wait n amount of seconds between pages
                console.log("Switching in " + domain["switch-time"] + " seconds");
                await sleep(domain["switch-time"] * 1000);
            }
        }
    }
})();
