//this is the trial code
//npm install request
let request = require("request");
//npm install cheerio
let cheerio = require("cheerio");
//npm install path
let path = require("path");
//npm install xlsx
let xlsx = require("xlsx");


let fs = require("fs");
request("https://gaana.com/topcharts", requestKAns);
function requestKAns(err, res, html){
    let sTool = cheerio.load(html);
    let topChartsPageUrl = sTool("a[data-type = 'play'].play");
    console.log(topChartsPageUrl.length);
    
    //console.log(everyPlaylistUrl.length);
    for(let i = 0; i < topChartsPageUrl.length; i++){
    //  console.log(topChartsPageUrl);
        let everyPlaylistUrl = sTool(topChartsPageUrl[i]).attr("href");//.attr() gives only first component
        let fUrl = "https://gaana.com" + everyPlaylistUrl;
        //console.log(fUrl);
        request(fUrl, listOfSongs );
    }
        
    

}
/*what I want to do
raw -> playlistName -> all songs individual folders -> respective excel files(1 in each folder)
OR
idea 2 => raw -> playlistName -> excel files of all songs
let playistName = sTool("div._t1").text().trim().replace(/[#?_)("|]/g,'');
    let dirPath = playistName;
    if(fs.existsSync(dirPath)){//do nothing
        //console.log("Folder Exists");
    }else{//create new folder
        fs.mkdirSync(dirPath);
    }
*/
function listOfSongs(err, res, html){
    let sTool = cheerio.load(html);
    let rowsOfSong = sTool("li.draggable");
    //console.log("hello");
    //console.log(rowsOfSong.length);

    //console.log(rowsOfSong.length);
    /*let dirPath = noOfPLaylist;
    if(fs.existsSync(dirPath)){//do nothing
        //console.log("Folder Exists");
    }else{//create new folder
        fs.mkdirSync(dirPath);
    }*/
    let playListName = sTool("._t ._t1").find("h1").text().trim().replace(/[[#_!()?/*"<]/g, '').replace(/]/g,'');
    console.log(playListName);
    for(let j = 0; j < rowsOfSong.length; j++){
        
        let albumName = sTool(rowsOfSong[j]).find("li.s_title.p_title").find("a[data-type='playSong']").text().trim().replace(/[[#_!()?/*"<]/g, '').replace(/]/g,'');//this will give jth song name
        let artistsName = sTool(rowsOfSong[j]).find("li.s_artist.p_artist").text().trim();//this will give jth artist name
        let timeDuration = sTool(rowsOfSong[j]).find("a.desktop.sng_c").text().trim();//this will give time duration of jth song
        console.log(`Album:${albumName}   Artist:${artistsName}   Time:${timeDuration}`);
        //console.log(j);
        processSong(playListName, albumName, artistsName, timeDuration);//to process every song's data
    }
    console.log();
    
 
}

function processSong(playListName, albumName, artistsName, timeDuration){
    let eachSongDetail = { //object that stores each song details
        Album:albumName,
        Artists:artistsName,
        Time:timeDuration
    }
    
    //STEPS
    //check folder i.e does this entry belong to an existing song
    //if folder exists then print else create a new folder
    let dirPath = playListName;
    if(fs.existsSync(dirPath)){//do nothing
        //console.log("Folder Exists");
    }else{//create new folder
        fs.mkdirSync(dirPath);
    }
    //if file exists => data append in file
    //else create new file and add data
    let songFilePath= path.join(dirPath, albumName+".xlsx").replace(/[[#_!()?/*"<]/g, '').replace(/]/g,'');
    let sData = [];
    if(fs.existsSync(songFilePath)){//i.e if this is player's 2nd or further match
        sData = excelReader(songFilePath, albumName);
        sData.push(eachSongDetail);
    }else{//i.e this is player's first match
        //create file
        console.log("File of song",songFilePath,"created");
        sData = [eachSongDetail];
    }
    excelWriter(songFilePath,sData,albumName);
}


function excelReader(filePath, name){//got this function from stack overflow
    if(!fs.existsSync(filePath)){
        return null;
    }else{
        //workbook => excel
        let wt = xlsx.readFile(filePath);
        //get data from workbook
        let excelData = wt.Sheets[name];
        //convert excel format to json => array of object
        let ans = xlsx.utils.sheet_to_json(excelData);
        //console.log(ans);
        return ans;
    }
}

function excelWriter(filePath, json, name){//sir wrote this function
    //console.log(xlsx.readFile(filePath));
    let newWB = xlsx.utils.book_new();
    //console.log(json);
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, name);
    //file => create, replace
    xlsx.writeFile(newWB, filePath);
}