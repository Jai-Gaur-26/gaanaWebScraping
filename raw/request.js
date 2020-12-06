//npm install request
let request = require("request");
//npm install cheerio
let cheerio = require("cheerio");

let fs = require("fs");
request("https://gaana.com/", requestKAns);
function requestKAns(err, res, html){//to navigate to "https://gaana.com/topCharts"
    let sTool = cheerio.load(html);
    let topChartsPageUrl = sTool("a.viewall").attr("href");
    //console.log(topChartsPageUrl.text());
    let fUrl = "https://gaana.com" + topChartsPageUrl[2];
    console.log(fUrl);
    topChartsPage(fUrl);
}

function topChartsPage(err, res, html){
    // let sTool = cheerio.load(html);
    // let topChartsPageContent = sTool(".lastend-container");
    // fs.writeFileSync("topChartsPageContent.html", topChartsPageContent.html());
    //console.log(err);
}