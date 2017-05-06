# Examples using docker with selenium

https://hub.docker.com/r/selenium/standalone-chrome-debug/

    docker run --rm -p 4444:4444 -p 5900:5900 selenium/standalone-chrome-debug:3.4.0

or

https://hub.docker.com/r/selenium/standalone-firefox-debug/


    docker run --rm -p 4444:4444 -p 5900:5900 selenium/standalone-firefox-debug:3.4.0

Connect to VNC using password `secret`

## Selenium Hub

    docker run -d -p 4444:4444 --name selenium-hub selenium/hub:3.4.0
    docker run -d -p 5901:5900 --link selenium-hub:hub selenium/node-chrome-debug:3.4.0
    docker run -d -p 5902:5900 --link selenium-hub:hub selenium/node-firefox-debug:3.4.0
