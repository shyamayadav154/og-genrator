const express = require("express");
const puppeteer = require("puppeteer");

const pup = require("./puppeteer");

const app = express();

app.get("/og-image-2", async (req, res) => {
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
    await page.goto(link, { waitUntil: "networkidle2" });
    // retry if 404
    if (page.url().includes("404")) {
      await page.goto(link, { waitUntil: "networkidle2" });
    }
    const screenshot = await page.screenshot({
      type: "jpeg",
      clip: { x: 240, y: 20, width: 900, height: 600 },
    });
    await browser.close();

    res.set("Content-Type", "image/jpeg");
    res.send(screenshot);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/og-image",pup.generateImage )

app.listen(4000, () => {
  console.log("OG image API running on port 4000");
});
