import fs from "fs";
import http from "http";
import url from "url";
import slugify from "slugify";

import replaceTemplate from "./modules/replaceTemplate.js";

///////////////////////////////////////

// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textInput)

// const textOut = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)

// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log(data)
// })

/////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`./templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`./templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`./templates/template-product.html`,"utf-8");

const data = fs.readFileSync(`./dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
      
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  } else if (pathname === "/product") {
      res.writeHead(200, {
        "Content-type": "text/html",
      });

      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product);

      res.end(output);
  } else if (pathname === "/api") {
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(data);
  } else {
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      res.end("<h1>Page not found</h1>");
  }

    // res.end()
});

server.listen(8000, "127.0.0.1", () => {
  console.log("LISTENING TO REQUESTS ON PORT 8000");
});
