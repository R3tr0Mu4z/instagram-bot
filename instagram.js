#!/usr/bin/env node
const program = require('commander');
const fse = require('fs-extra');
const fetch = require('isomorphic-fetch');
const puppeteer = require('puppeteer');
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const inquirer   = require('inquirer');

clear();
console.log('' +
    '' +
    '' +
    '' +
    '' +
    '' +
    '' +
'\'####:\'##::: ##::\'######::\'########::::\'###:::::\'######:::\'########:::::\'###::::\'##::::\'##:\'########::::\'#####:::\'########:\n' +
'. ##:: ###:: ##:\'##... ##:... ##..::::\'## ##:::\'##... ##:: ##.... ##:::\'## ##::: ###::\'###: ##.... ##::\'##.. ##::... ##..::\n' +
': ##:: ####: ##: ##:::..::::: ##:::::\'##:. ##:: ##:::..::: ##:::: ##::\'##:. ##:: ####\'####: ##:::: ##:\'##:::: ##:::: ##::::\n' +
': ##:: ## ## ##:. ######::::: ##::::\'##:::. ##: ##::\'####: ########::\'##:::. ##: ## ### ##: ########:: ##:::: ##:::: ##::::\n' +
': ##:: ##. ####::..... ##:::: ##:::: #########: ##::: ##:: ##.. ##::: #########: ##. #: ##: ##.... ##: ##:::: ##:::: ##::::\n' +
': ##:: ##:. ###:\'##::: ##:::: ##:::: ##.... ##: ##::: ##:: ##::. ##:: ##.... ##: ##:.:: ##: ##:::: ##:. ##:: ##::::: ##::::\n' +
'\'####: ##::. ##:. ######::::: ##:::: ##:::: ##:. ######::: ##:::. ##: ##:::: ##: ##:::: ##: ########:::. #####:::::: ##::::\n' +
    '....::..::::..:::......::::::..:::::..:::::..:::......::::..:::::..::..:::::..::..:::::..::........:::::.....:::::::..:::::\n' +
    '' +
    '' +
    'By git@R3tr0mu4z');

program
    .version('1.0')
    .option('--followers [value]', 'Scrape followers of a user --followers target-username -u USERNAME -p PASSWORD -f FILENAME')
    .option('--following [value]', 'Scrape following of a user --following target-username -u USERNAME -p PASSWORD -f FILENAME')
    .option('--posts [value]', 'Scrape posts from location, profile, tag, search page --posts https://www.instagram.com/muaz_asif -f FILENAME')
    .option('--likers [value]', 'Scrape likers from post --likers https://www.instagram.com/p/BtJOmVqFue1/ -u USERNAME -p PASSWORD -f FILENAME')
    .option('--like [value]', 'Like posts (import posts from json file) --like ./files/Posts.json  -u USERNAME -p PASSWORD -i SECONDS')
    .option('--comment [value]', 'Like posts (import posts from json file) --comment ./files/Posts.json -f ./files/Comments.json  -u USERNAME -p PASSWORD -i SECONDS')
    .option('--follow [value]', 'Follow users  --follow ./files/Users.json  -u USERNAME -p PASSWORD -i SECONDS')
    .option('-u, --username [value]', 'Your Username')
    .option('-p, --password [value]', 'Your Password')
    .option('-f, --file [value]', 'File Name', 'File')
    .option('-i, --interval <n>', 'Interval in seconds', '100')
    .option('--post [value]', 'File containing posts')
    .parse(process.argv);
     if (program.followers)
        following(program.following,program.username,program.password,program.file)
     if (program.posts)
        posts(program.posts,program.file);
     if (program.likers)
         likers(program.likers,program.username,program.password,program.file);
    if (program.like)
         like(program.like,program.username,program.password,program.interval);
    if (program.comment)
        comment(program.comment,program.file,program.username,program.password,program.interval);
    if (program.follow)
        follow(program.follow,program.username,program.password,program.interval);
// console.log(program)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function followers(target,user,pass,file,h) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.setViewport({ width: 414, height: 736});
    await page.goto('https://www.instagram.com/'+target+'/followers/');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', user);
    await page.type('input[name=password]', pass);
    await page.click('button[type=submit]');
    await sleep(5000);
    try {
        const linkHandlers = await page.$x("//button[contains(text(), 'Not Now')]");
        await linkHandlers[0].click();
        clear();
        console.log('working');
    } catch(e) {
        console.log('Error, try using -h false');
        return;
    }
    await sleep(5000);
    try {
        await sleep(2000);
        const linkHandlers = await page.$x('//*[@id="react-root"]/section/main/div/ul/li[2]/a')
        clear();
        console.log('working');
        await linkHandlers[0].click();
    } catch(e) {
        console.log('Error, try using -h false');
        return;
    }
    var n = 5000;
    var i = 0;
    await sleep(5000);
    autoScroll(page);
    while (i < n){
        try {
            var list = await page.$$('.PZuss li');
        } catch(e) {
            console.log(e);
        }
        var users = [];
        for (var li of list) {
        try {
            var user = await li.$eval('.FPmhX', e => e.getAttribute('href'));
            user = user.substring(1, user.length-1);
            users = users.concat(user);
            } catch(e) {
             console.log(e);
                return;
            }
        }
        await sleep(2000);
        i++;
        var json = JSON.stringify(users);
        clear();
        console.log('Total : '+users.length);
        if (users.length !== 0) {
            console.log('Saving file at files/'+file+'.json');
            fse.outputFile('files/'+file+'.json', json)
        }
    }
}

async function following(target,user,pass,file) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.setViewport({ width: 414, height: 736});
    await page.goto('https://www.instagram.com/accounts/login/?next=%2F'+user+'%2F&source=profile_posts');
    await page.waitFor('input[name=username]', {timeout : 4000});
    await page.type('input[name=username]', user);
    await page.type('input[name=password]', pass);
    await page.click('button[type=submit]');
    await sleep(2000);
    try {
        const linkHandlers = await page.$x("//button[contains(text(), 'Not Now')]");
        await linkHandlers[0].click();
    } catch(e) {
        console.log(e)
    }
    try {
        await sleep(2000);
        const linkHandlers = await page.$x('//*[@id="react-root"]/section/main/div/ul/li[3]/a')
        await linkHandlers[0].click();
    } catch(e) {
        console.log(e)
    }
    autoScroll(page);
    var n = 5000;
    var i = 0;
    var users = [];
    while (i < n){
        var list = await page.$$('li');
        for (var li of list) {
            try {
                var user = await li.$eval('.notranslate', e => e.getAttribute('href'));
                user = user.substring(1, user.length - 1);
                users = users.concat(user);
                users = [...new Set(users)];
            } catch(e) {

            }
        }
        i++;
        var json = JSON.stringify(users);
        clear();
        if (users.length !== 0) {
            console.log('File saved at /files'+file+'.json');
            fse.outputFile('files/'+file+'.json', json)
        }
    }
}

async function posts(url,file) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.goto(url);
    await sleep(2000);
    await page.goto(url);
    await page.waitFor('.Nnq7C');
    autoScroll(page);
    var links = {};
    var i = 0;
    var n = 50000;
    var posts = [];
    while (i < n) {
        var list = await page.$$('.Nnq7C');
        for (var li of list) {
            post = await page.$$eval('.Nnq7C a', as => as.map(a => a.href));
            await sleep(1000);
            i++;
            posts = posts.concat(post);
            let u = [...new Set(posts)];
            var json = JSON.stringify(u);
            if (u.length !== 0) {
                fse.outputFile('files/'+file+'.json', json)
                clear();
                console.log('file saved at files/'+file+'.json')
            }
        }
    }
}

async function likers(post,user,pass,file) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.setViewport({ width: 414, height: 736});
    await page.goto('https://www.instagram.com/accounts/login/?next=%2Fmuaz_asif%2F&source=profile_posts');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', user);
    await page.type('input[name=password]', pass);
    await page.click('button[type=submit]');
    await sleep(2000);
        console.log('Scraping likers from '+post)
        await page.goto(post);
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
                clear();
                console.log('total : ' + u.length);
                var json = JSON.stringify(u);
                if (u.length !== 0) {
                    console.log('file saved at files/'+file+'.json')
                    fse.outputFile('files/'+file+'.json', json)
                }
            }
        }
        browser.close();
}

async function like(location,user,pass,interval) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', user);
    await page.type('input[name=password]', pass);
    await page.click('button[type=submit]');
    let links = await fse.readFile(location);
    links = JSON.parse(links);
    await sleep(2000);
    for (var li of links) {
        await page.goto(li);
        clear();
        console.log('liking '+li);
        await page.waitFor('span.glyphsSpriteHeart__outline__24__grey_9');
        await page.click('span.glyphsSpriteHeart__outline__24__grey_9');
        await sleep(interval*1000);
    }
}

async function comment(posts,comments,user,pass,interval) {
    console.log('launching puppeteer')
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', user);
    await page.type('input[name=password]', pass);
    await page.click('button[type=submit]');
    await sleep(2000);
    var links = await fse.readFile(posts);
    var comments = await fse.readFile(comments);
    links = JSON.parse(links);
    comments = JSON.parse(comments);
    for (var li of links) {
        await page.goto(li);
        var comment = comments[Math.floor(Math.random()*comments.length)];
        await page.type('textarea', comment);
        clear();
        console.log(comment + 'on '+ li)
        await page.keyboard.press('Enter');
        await sleep(interval*1000);
    }
}



async function follow(users,user,pass,interval) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', user);
    await page.type('input[name=password]', pass);
    await page.click('button[type=submit]');
    await sleep(5000);
    var list = await fse.readFile(users);
    list = JSON.parse(list);
    for (var li of list) {
        try {
            await page.goto('https://www.instagram.com/' + li);
            try {
                const linkHandlers = await page.$x("//button[contains(text(), 'Follow')]");
                await linkHandlers[0].click();
                clear();
                console.log('following ' + li);
            } catch (e) {

            }
        } catch(e) {

        }
        await sleep(interval*1000);
    }
    browser.close();
    return;
}

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


