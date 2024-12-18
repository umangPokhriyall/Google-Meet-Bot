"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = new chrome_1.Options({});
        options.addArguments("--disable-blink-features=AutomationControlled");
        // options.addArguments("--use-fake-ui-for-media-stream")
        let driver = yield new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.CHROME).setChromeOptions(options).build();
        try {
            yield driver.get('https://meet.google.com/nhc-bdbw-yke');
            // await driver.findElement(By.name('q')).sendKeys('abc', Key.RETURN)
            // await driver.findElement(By.name('q')).sendKeys('abc', Key.RETURN)
            //*[@id="yDmH0d"]/div[3]/span/div[2]/div/div/div[2]/div/button/span[6]
            const popupButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//span[contains(text(),"Got it")]')), 10000);
            yield popupButton.click();
            const nameInput = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//input[contains(@placeholder,"Your name")]')), 10000);
            yield nameInput.clear();
            yield nameInput.click();
            yield nameInput.sendKeys('value', "meetingBot");
            const buttonInupt = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//span[contains(text(),"Ask to join")]')), 10000);
            yield buttonInupt.click();
            yield driver.wait(selenium_webdriver_1.until.titleIs('sdfsf - Google Search'), 100000);
        }
        finally {
            yield driver.quit();
        }
    });
}
main();
