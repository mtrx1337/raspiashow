# Configuration

The configuration of the TV app is specified in a json file (example below). It has to be hosted on some kind of webserver so the application can fetch it. The URL to the configuration file has to be specified when building the image. Several options are supported.

# Example configuration file

```json
{
    "configuration": {

        "domains": [
            "https://google.com/",
            "https://youtube.com/",
            "https://reddit.com/"
        ],

        "switch_time" : 10
    }
}
```
