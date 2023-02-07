const puppeteer = require("puppeteer");

exports.generateImage = async function (req, res) {
  const { link } = await req.query;

  if(!link) {
    return res.status(400).send({ error: "Link parameter is required" });
    }

    // check if link is valid
    const regex = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
        "i"
    ); // fragment locator
    if (!regex.test(link)) {
        return res.status(400).send({ error: "Link parameter is not valid" });
    }


   const browser = await puppeteer.launch({
    // executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox"],
    headless: true,

   });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(link, { waitUntil: "domcontentloaded" });
  // retry if 404
  if (page.url().includes("404")) {
    await page.goto(link, { waitUntil: "domcontentloaded" });
  }
  const image = await page.screenshot({
    type: "jpeg",
    clip: { x: 240, y: 20, width: 900, height: 600 },
  });

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/jpeg`);
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );
  res.end(image);
};
