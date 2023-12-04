# SlideCaptcha

![GitHub](https://img.shields.io/github/license/techcnet/ProcessPageViewStat)
![GitHub last commit](https://img.shields.io/github/last-commit/techcnet/ProcessPageViewStat)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/techcnet)

PageViewStatistic for ProcessWire is a module to log page visits of the CMS. The records including some basic information like IP-address, browser, operating system, requested page and originate page. Please note that this module doesn't claim to be the best or most accurate.

## Advantages
One of the biggest advantage is that this module doesn't require any external service like Google Analytics or similar. You don't have to modify your templates either. There is also no JavaScript or image required.

## Disadvantages
There is only one disadvantage. This module doesn't record visits if the browser loads the page from its browser cache. To prevent the browser from loading the page from its cache, add the following meta tags to the header of your page:

````html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
````

## How to use
The records can be accessed via the Setup-menu of the CMS backend. The first dropdown control changes the view mode.

!["Select a view mode"](https://tech-c.net/site/assets/files/1188/view-mode.jpg)
