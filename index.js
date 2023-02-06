const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/og-image", async (req, res) => {
  const link = req.query.link;
  if (!link) {
    return res.status(400).send({ error: "Link parameter is required" });
  }
  

  

  try {
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(link, { waitUntil: "networkidle2", });
    //if 404 retry
    if (page.url().includes("404")) {
      await page.goto(link, { waitUntil: "networkidle2", });
    }
    const screenshot = await page.screenshot({
      type: "jpeg",
      clip: { x: 240, y: 20, width: 900, height: 600 },
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/jpeg");
      res.setHeader(
        "Cache-Control",
        `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
      );

    res.end(screenshot);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
  await browser.close();
});

app.listen(4000, () => {
  console.log("OG image API running on port 4000");
});
