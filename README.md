# What is Raspiashow?

Raspiashow is a small program that will display and cycle through websites. To configure the displayed websites a remote configuration file is used so you don't have to edit a configuration file on the device you're running the program.

This project is intended to be run on a RaspberryPi with a minimal Raspbian image.

# Configuration

The configuration of the TV app is specified in a json file (example below). It has to be hosted on some kind of webserver so the application can fetch it. The URL to the configuration file has to be specified when building the image. Several options are supported.

## Domains
    
Domains must follow the https://xxxxx.yy/zzzzzz scheme.
    
## Timeouts

Per domain you can specify a timeout, which will trigger the next site.

## JS Injection

Optionally, you can inject a custom css file with the "css" parameter. If you don't want to, just leave the third item in the list blank.

## CSS Injection

Optionally, you can inject a custom css file with the "css" parameter. If you don't want to, just leave the third item in the list blank.

# Reference configuration file

```json
{
    "configuration": {
        "domains": [
            {
                "url": "https://mycompany.com/blog/",
                "switch-time": 60
            },
            {
                "url": "https://reddit.com/",
                "switch-time": 60,
                "css": "https://example.com/files/custom.css"
                "js": "https://example.com/files/custom.js"
            }
        ]
    }
}
```

