import chrome from "chrome-aws-lambda";
import fetch from "node-fetch";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method === "POST" && req.url === "/api/vsco") {
    const { username } = req.body;
    let browser = null;
    try {
      const executablePath = process.env.CHROME_EXECUTABLE_PATH || (await chrome.executablePath);
      browser = await chrome.puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath,
        headless: chrome.headless,
      });
      const page = await browser.newPage();


    await page.goto(`https://vsco.co/${username}/gallery`);

    if ((await page.title()) !== "Page Not Found | VSCO") {
      let loadMoreButton = await page.$('[class="css-oww03x e1xqpt600"]');
      while (loadMoreButton !== null) {
        await loadMoreButton.click();
        await page
          .waitForSelector('[class="css-oww03x e1xqpt600"]', { timeout: 3000 })
          .catch(() => console.log("Load more button disappeared"));
        loadMoreButton = await page.$('[class="css-oww03x e1xqpt600"]');
      }

      const scrollStep = 1000;
      const scrollDelay = 10;
      let scrollCount = 0;

      while (scrollCount < 1200) {
        await page.evaluate((scrollStep) => {
          window.scrollBy(0, scrollStep);
        }, scrollStep);

        scrollCount++;
        await page.waitForTimeout(scrollDelay);
      }

      const imgList = await page.evaluate(() => {
        const vscoList = document.querySelectorAll("section div figure a");
        const imgArray = [...vscoList];
        const imgList = imgArray.map((a) => ({
          href: a.href,
        }));
        return imgList;
      });

      const imageSrcList = [];

      for (let i = 0; i < imgList.length; i++) {
        const imgPage = await browser.newPage();
        await imgPage.goto(imgList[i].href);
        await imgPage.waitForSelector(
          "body > div > div > main > div > div > div > div > div > img"
        );
        const imgSrc = await imgPage.evaluate(() => {
          const img = document.querySelector(
            "body > div > div > main > div > div > div > div > div > img"
          );
          return img ? img.src : null;
        });
        imageSrcList.push(imgSrc);
        await imgPage.close();
      }

      const uniqueImageSrcList = Array.from(new Set(imageSrcList));

      const startTime = new Date();
      const images = [];
      for (let i = 0; i < uniqueImageSrcList.length; i++) {
        const response = await fetch(uniqueImageSrcList[i]);
        const buffer = await response.buffer();
        images.push({ name: `${i}.jpg`, buffer });
      }

      const zip = new JSZip();
      for (const image of images) {
        zip.file(image.name, image.buffer);
      }
      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      const endTime = new Date();
      const timeDiff = (endTime - startTime) / 1000;

      const filename = `${uuidv4()}.zip`;

      fs.writeFileSync(filename, zipBuffer);

      await browser.close();
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", zipBuffer.length);
      res.send(zipBuffer);

      res.status(303).setHeader("Location", "/").end();
    } else {
      await browser.close();
      res.status(303).setHeader("Location", "/").end(); 
    }
  } catch {
    res.status(404);
  }
} 
}
