var express = require('express');
var router = express.Router();
// var app = express();
var bodyParser = require('body-parser');
var fse = require('fs-extra');
var fetch = require('isomorphic-fetch')
// const PORT = process.env.PORT || 8080;
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
var request = require('ajax-request');
const puppeteer = require('puppeteer');
function sleep(ms) {
    // console.log('waiting for '+ ms);
    return new Promise(resolve => setTimeout(resolve, ms));
}

// app.post('/follow', function(request, response) {
//     var username = request.body.username;
//     var password = request.body.password;
//     console.log(request.body.password);
//     var list = [];
//
//     response.send('Process');
//     var process =  follow(username, password, list);
// });
async function followers() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.setViewport({ width: 414, height: 736});
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Ffollowintheirfootsteps%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', '');
    await page.type('input[name=password]', '');
    await page.click('button[type=submit]');
    await sleep(2000);
    try {
        const linkHandlers = await page.$x("//button[contains(text(), 'Not Now')]");
        await linkHandlers[0].click();
    } catch(e) {
        console.log('noo')
    }
    try {
        await sleep(2000);
        const linkHandlers = await page.$x('//*[@id="react-root"]/section/main/div/ul/li[2]/a')
        await linkHandlers[0].click();
    } catch(e) {
        console.log(e)
    }


    var n = 5000;
    var i = 0;
    await sleep(2000);
    autoScroll(page);
    while (i < n){

        var list = await page.$$('.PZuss li');
        var users = [];
        for (var li of list) {
            var user = await li.$eval('.notranslate', e => e.getAttribute('href'));
            user = user.substring(1, user.length-1);
            users = users.concat(user);
            console.log(users);
        }
        await sleep(2000);
        i++;

        var json = JSON.stringify(users);
        console.log(users.length);
        if (users.length !== 0) {
            fse.outputFile('files/users.json', json)
        }
    }
}

async function following() {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.setViewport({ width: 414, height: 736});
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Ftraveller.muaz%2F&source=profile_posts');

    await page.waitFor('input[name=username]', {timeout : 4000});
    await page.type('input[name=username]', '');
    await page.type('input[name=password]', '');
    await page.click('button[type=submit]');
    await sleep(2000);

    try {
        const linkHandlers = await page.$x("//button[contains(text(), 'Not Now')]");
        await linkHandlers[0].click();
    } catch(e) {
        console.log('noo')
    }
    try {
        await sleep(2000);
        const linkHandlers = await page.$x('//*[@id="react-root"]/section/main/div/ul/li[3]/a')
        await linkHandlers[0].click();
    } catch(e) {
        console.log(e)
    }

    // autoScroll(page);
    var n = 5000;
    var i = 0;
    var users = [];
    while (i < n){

        var list = await page.$$('li');
        for (var li of list) {
            var user = await li.$eval('a.FPmhX', e => e.getAttribute('href'));
            user = user.substring(1, user.length-1);
            users = users.concat(user);
            console.log(users);
        }
        i++;

        var json = JSON.stringify(users);
        console.log(users.length);
        if (users.length !== 0) {
            fse.outputFile('files/users.json', json)
        }
    }
}

async function posts() {
    console.log('launching puppeteer')
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Ffollowforfollowback%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', '');
    await page.type('input[name=password]', '');
    await page.click('button[type=submit]');
    await sleep(2000);
    await page.goto('https://www.instagram.com/explore/tags/followforfollowback/');
    await page.waitFor('.Nnq7C');
    autoScroll(page);
    var links = {};
    var i = 0;
    var n = 50000;
    var users = [];
    while (i < n) {
        var list = await page.$$('.Nnq7C');
        for (var li of list) {
            user = await page.$$eval('.Nnq7C a', as => as.map(a => a.href));
            await sleep(1000);
            i++;

            users = users.concat(user);
            let u = [...new Set(users)];
            console.log(u);
            var json = JSON.stringify(u);
            if (u.length !== 0) {
                fse.outputFile('files/travel.json', json)
            }
        }
    }
}

async function likers(post,file) {
    console.log('launching puppeteer')
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.setViewport({ width: 414, height: 736});
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Ffollowforfollowback%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', 'muaz_asif');
    await page.type('input[name=password]', '');
    await page.click('button[type=submit]');
    await sleep(2000);

        await page.goto('https://www.instagram.com/p/'+post);
        // await sleep(50000);
        try {
            const linkHandlers = await page.$x('//*[@id="react-root"]/section/main/div/div/article/div[2]/section[2]/div/div/a');
            await linkHandlers[0].click();
        } catch(e) {
            console.log(e);
        }
        autoScroll(page);
        var links = {};
        var i = 0;
        var n = 157;
        var users = [];
        var prev  = 0;
        while (i < n) {
            var list = await page.$$('._7UhW9');
            for (var i = 0; i < list.length; i++) {
                user = await page.$$eval('._7UhW9 a', as => as.map(a => a.innerText));
                await sleep(1000);
                i++;

                users = users.concat(user);
                let u = [...new Set(users)];
                console.log(post + ' total : ' + u.length+ ' '+ i);
                var json = JSON.stringify(u);
                if (u.length !== 0) {
                    console.log('file saved at '+file+'/'+post+'.json')
                    fse.outputFile('files/'+file+'/'+post+'.json', json)
                }
            }
        }
        browser.close();
        console.log('moving to next');
        return;
}

async function getlikers() {


}

async function like() {
    console.log('launching puppeteer')
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Fgentlebikers%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', '');
    await page.type('input[name=password]', '');
    await page.click('button[type=submit]');
    var links = await getjson();
    console.log(links);
    await sleep(2000);
    for (var li of links) {
        await page.goto(li);
        console.log('liking '+li);
        await page.waitFor('span.glyphsSpriteHeart__outline__24__grey_9');
        await page.click('span.glyphsSpriteHeart__outline__24__grey_9');
        await sleep(180000);
    }
}

async function comment() {
    console.log('launching puppeteer')
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Fgentlebikers%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', '');
    await page.type('input[name=password]', '');
    await page.click('button[type=submit]');
    await sleep(2000);
    var links = await getjson();
    var comments = ["That's amazing! I like it ๐","Love it !", "Your posts are truly amazing ๐","Moments that stay forever","This shot is great ๐”", "๐๐๐๐ ", "Ah such a happy location! ๐‘", "Stunning ๐‘", "๐wow, great pic๐‘"]
    for (var li of links) {
        await page.goto(li);
        var comment = comments[Math.floor(Math.random()*comments.length)];
        await page.type('textarea', comment);
        console.log(comment + 'on '+ li)
        await page.keyboard.press('Enter');
        await sleep(180000);
    }
}


async function likecomment() {
    console.log('launching puppeteer')
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Fgentlebikers%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', '');
    await page.type('input[name=password]', '');
    await page.click('button[type=submit]');
    await sleep(2000);
    var links = await getjsonposts();
    var comments = ["That's amazing! I like it ๐","Love it !", "Your posts are truly amazing ๐","Moments that stay forever","This shot is great ๐”", "๐๐๐๐ ", "Ah such a happy location! ๐‘", "Stunning ๐‘", "๐wow, great pic๐‘",,"What a surreal post ๐ค—","loving the content ๐’—","What a stunning post","What an amazing shot ๐๐๐","Epic โค๐","Amazing ๐‘๐ผ","Awesome๐๐’•","Nice ๐๐๐","Nice ๐","Epic ๐ฎ"]
    var i = 0;
    for (var li of links) {
        await page.goto(li);
        console.log('testing')
        try {
            await page.waitFor('span.glyphsSpriteHeart__outline__24__grey_9', {timeout : 4000});
            await page.click('span.glyphsSpriteHeart__outline__24__grey_9')
            await page.waitFor('.FPmhX', {timeout : 4000});
            var username = await page.$eval('.notranslate', e => e.title);
            console.log(username);
            var comment = comments[Math.floor(Math.random()*comments.length)] + ' @'+username;
            await page.type('textarea', comment);
            await sleep(2000);
            await page.focus('textarea')
            await page.keyboard.press('Enter');
            await page.keyboard.press('Enter');
            console.log(comment + 'on '+ li)
            await sleep(120000);
            i++;
        } catch(e) {
            console.log(e);
        }
    }
}

async function tagusers() {
    var links = await getjson();
    const browser = await puppeteer.launch({headless: true});
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    const page = await browser.newPage();
    await sleep(2000);
    var users = [];
    for (var li of links) {
        try {
            await page.goto(li);
            await page.waitFor('span.glyphsSpriteHeart__outline__24__grey_9', {timeout: 4000});
            user = await page.$eval('.notranslate', e => e.getAttribute('href'));
            users = users.concat(user);
            let u = [...new Set(users)];
            var json = JSON.stringify(u);
            console.log(u.length);
            if (u.length !== 0) {
                fse.outputFile('files/tagusers.json', json)
            }
        } catch(e) {
            console.log('err')
        }
    }
}
async function getjson(url) {
    const response = await fetch(url);
    console.log('getting '+ url)
    const json = await response.json();
    return json;
}

async function getjsonposts() {
    const response = await fetch('https://api.myjson.com/bins/1bgga8');
    const json = await response.json();
    return json;
}

async function follow(user, pass) {
    let response = await fetch('http://127.0.0.1/follower/'+user);
    let json = await response.json();
    let url = json[0]['url'];
    console.log(url);
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Fnoorain_sayed%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', user);
    await page.type('input[name=password]', pass);
    await page.click('button[type=submit]');
    await sleep(5000);
    var list = await getjson(url);
    list = [...new Set(list)];
    for (var j = json[0]['last']; j < list.length; j++) {
        try {
            await page.goto('https://www.instagram.com/' + list[j]);
            try {
                const linkHandlers = await page.$x("//button[contains(text(), 'Follow')]");
                await linkHandlers[0].click();
                console.log(user + ' following ' + list[j]);
            } catch (e) {

            }
            let total = list.length - 1;
            let response = await fetch('http://127.0.0.1/number/' + user + '/' + total + '/' + j);
        } catch(e) {

        }
        await sleep(108000);
    }
}
async function start() {
    // follow('mountainbiking4lyf');
    // await sleep(10800);
    follow('catz_4_lyf_');
    await sleep(10800);
    follow('kittie4lyf');
    await sleep(10800);
    follow('mtb_for_lifez');
}
start();
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            console.log('scrolling...');
            var totalHeight = 0;
            var distance = 1000000;
            var timer = setInterval(() => {
                console.log('testing here')
                var elmnt = document.getElementsByClassName("pbNvD");
                console.log(elmnt,' element')
                var scrollHeight = elmnt.scrollHeight;
                console.log(scrollHeight);
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 1000);
        });
    });
}
async function blockImages(page) {
    page.on('request', interceptedRequest => {
        if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg')){
            interceptedRequest.abort();
        } else{
            interceptedRequest.continue();
        }
    });
}
// console.log('test')
// console.log("Running on port "+ PORT);
// app.listen(PORT);
