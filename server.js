var request = require('request');
var express = require('express');
var fs = require('fs');
var cheerio = require('cheerio');
//var URL = require('url-parse');
var app = express();

app.get('', function (req, res) {

    var MAX_PAGES_TO_VISIT = 10;
    var baseUrl = 'https://www.youtube.com';
    var json = [];
    var title = '', url = '/watch?v=8Zw_i0Sn8S0'; //geri-nikol or chalga

    function nextSong(url) {
        var nextUrl = ''
        request(baseUrl + url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                console.log('visiting ' + (baseUrl + url));
                title = $('#eow-title').text().trim();
               /* if(hasntGotUrl(json, url) && json.length < MAX_PAGES_TO_VISIT){
                    console.log(json.length)
                    json.push({title: title, nextSongUrl: url})
                }*/

                json.push({title: title, nextSongUrl: url})
                nextUrl = $('.autoplay-bar .thumb-wrapper').children()[0].attribs['href'];
                console.log('next url ' + url);

                if (json.length >= MAX_PAGES_TO_VISIT) {
                    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
                        console.log('File successfully written! - Check your project directory for the output.json file');
                    })
                    return;
                }
                else {
                    nextSong(nextUrl);
                }
            } else {
                console.log(error);
            }
        })
    }

    function hasntGotUrl(array, url){
        array.forEach(function(song){
            if(url !== song.url){
               return true;
            }
        })
    }

   nextSong(url);
    /* for (var i = 0; i < MAX_PAGES_TO_VISIT; i++) {
     pageToVisit = baseUrl + nextSongUrl;
     console.log(nextSongUrl);
     request(pageToVisit, function (error, response, html) {
     // console.log('page to visit: ' + pageToVisit);
     if (!error && response.statusCode == 200) {
     var $ = cheerio.load(html);
     console.log('visiting ' + pageToVisit);
     //var data = $(this);
     title = $('#eow-title').text().trim();
     nextSongUrl = $('.autoplay-bar .thumb-wrapper').children()[0].attribs['href'];

     //nextSongUrl = $('.content-wrapper').children()[0].attribs['href'];
     console.log(nextSongUrl);
     //title = $('.content-wrapper.title').text();

     json.title = title;
     json.nextSongUrl = nextSongUrl;


     } else {
     console.log(error);
     }
     })

     */
    res.send('Check your console!')
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
