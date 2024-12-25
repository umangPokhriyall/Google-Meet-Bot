import { Builder, Browser, By, Key, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

async function getDriver(){
    const options = new Options({})
    options.addArguments("--disable-blink-features=AutomationControlled")
    options.addArguments("--use-fake-ui-for-media-stream")

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    return driver;

}
async function openMeet(driver:WebDriver){

    try {
        await driver.get('https://meet.google.com/jyc-ipyu-bbi')
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
        await driver.sleep(10000);
    } finally {
        // await driver.quit()
    }
}

async function startScreenShare(driver:WebDriver) {
    console.log("StartScreenShareCalled")
    const response = await driver.executeScript(`

        function wait(delayInMS) {
            return new Promise((resolve) => setTimeout(resolve, delayInMS));
        }

        function startRecording(stream, lengthInMS) {
            let recorder = new MediaRecorder(stream);
            let data = [];
            
            recorder.ondataavailable = (event) => data.push(event.data);
            recorder.start();
            
            let stopped = new Promise((resolve, reject) => {
                recorder.onstop = resolve;
                recorder.onerror = (event) => reject(event.name);
            });
            
            let recorded = wait(lengthInMS).then(() => {
                if (recorder.state === "recording") {
                recorder.stop();
                }
            });
            
            return Promise.all([stopped, recorded]).then(() => data);
        }
      
        console.log("before mediadevices")
        window.navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "browser"
            },
            audio: true,
            preferCurrentTab: true
        }).then(async screenStream => {                        
            const audioContext = new AudioContext();
            const screenAudioStream = audioContext.createMediaStreamSource(screenStream)
            const audioEl1 = document.querySelectorAll("audio")[0];
            const audioEl2 = document.querySelectorAll("audio")[1];
            const audioEl3 = document.querySelectorAll("audio")[2];
            const audioElStream1 = audioContext.createMediaStreamSource(audioEl1.srcObject)
            const audioElStream2 = audioContext.createMediaStreamSource(audioEl3.srcObject)
            const audioElStream3 = audioContext.createMediaStreamSource(audioEl2.srcObject)

            const dest = audioContext.createMediaStreamDestination();

            screenAudioStream.connect(dest)
            audioElStream1.connect(dest)
            audioElStream2.connect(dest)
            audioElStream3.connect(dest)

            // window.setInterval(() => {
            //   document.querySelectorAll("audio").forEach(audioEl => {
            //     if (!audioEl.getAttribute("added")) {
            //       console.log("adding new audio");
            //       const audioEl = document.querySelector("audio");
            //       const audioElStream = audioContext.createMediaStreamSource(audioEl.srcObject)
            //       audioEl.setAttribute("added", true);
            //       audioElStream.connect(dest)
            //     }
            //   })

            // }, 2500);
          
          // Combine screen and audio streams
          const combinedStream = new MediaStream([
              ...screenStream.getVideoTracks(),
              ...dest.stream.getAudioTracks()
          ]);

          const audioStream = dest.stream;
          const audioRecordedChunks = await startRecording(audioStream, 10000);
          
          console.log("before start recording")
          const combinedRecordedChunks = await startRecording(combinedStream, 10000);
          console.log("after start recording")
          
          let combinedRecordedBlob = new Blob(combinedRecordedChunks, { type: "video/webm" });
          let audioRecordedBlob = new Blob(audioRecordedChunks, { type: "audio/webm" });
          
          // Create download for video with audio
          const recording = document.createElement("video");
          recording.src = URL.createObjectURL(combinedRecordedBlob);

          const audioRecording = document.createElement("audio");
          audioRecording.src = URL.createObjectURL(audioRecordedBlob);
          
          const downloadVideoButton  = document.createElement("a");
          downloadVideoButton.href = recording.src;
          downloadVideoButton.download = "RecordedScreenWithAudio.webm";    
          downloadVideoButton.click();

          const downloadAudioButton = document.createElement("a");
          downloadAudioButton.href = audioRecording.src;
          downloadAudioButton.download = "RecordedWithAudio.webm";    
          downloadAudioButton.click();
          
          console.log("after download button click")
          
          // Clean up streams
          screenStream.getTracks().forEach(track => track.stop());
          audioStream.getTracks().forEach(track => track.stop());
        })

        
        `)
        console.log(response);
        driver.sleep(100000);
}



async function main() {
    const driver =await getDriver()
    await openMeet(driver)
    await new Promise(x => setTimeout(x, 20000));
    await startScreenShare(driver);
}
main();