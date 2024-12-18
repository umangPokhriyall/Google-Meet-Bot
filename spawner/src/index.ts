import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

async function main() {
    const options = new Options({})
    options.addArguments("--disable-blink-features=AutomationControlled")
    // options.addArguments("--use-fake-ui-for-media-stream")
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    try {
        await driver.get('https://meet.google.com/nhc-bdbw-yke')
        // await driver.findElement(By.name('q')).sendKeys('abc', Key.RETURN)
        // await driver.findElement(By.name('q')).sendKeys('abc', Key.RETURN)
        //*[@id="yDmH0d"]/div[3]/span/div[2]/div/div/div[2]/div/button/span[6]
        const popupButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(),"Got it")]')),10000)
        await popupButton.click();

        const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[contains(@placeholder,"Your name")]')),10000)
        await nameInput.clear();
        await nameInput.click();
        await nameInput.sendKeys('value',"meetingBot");
        
        const buttonInupt = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(),"Ask to join")]')),10000)
        await buttonInupt.click();


        await driver.wait(until.titleIs('sdfsf - Google Search'), 100000)
    } finally {
        await driver.quit()
    }
}
main();