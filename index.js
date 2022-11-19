const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");


// /////////////////////////////////////////
// //Files

// // //Blocking code - Synchronous
// // const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// // console.log(textIn);

// // const textOut = `This is what we know about the avocado : ${textIn}.\nCreated on ${Date.now()}`;

// // fs.writeFileSync('./txt/output.txt', textOut);

// // console.log('File Written');

// //Non-blocking code - Asynchronous
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err,    data2) => {
//         console.log(data2);

//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("Your file has been written");
//             })
//         })
//     })
// });

// const textOut = `Testing how to write to a file.\nCreated on ${Date.now()}`;

// fs.writeFile('./txt/output.txt', textOut, (err, data) => {
//     console.log('File Written');
// });


////////////////////////////////////
//Server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(el => slugify(el.productName, {lower:true}))

console.log(slugs)

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    //Overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {
            "Content-type" : "text/html"
        })

        const cardsHTML = dataObject.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
       
        res.end(output);

    //Product page
    } else if (pathname === '/products') {
        res.writeHead(200, {
            "Content-type" : "text/html"
        })
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //API page
    } else if (pathname === '/api') {
        res.writeHead(200, {
            "Content-type" : "application/json"
        })
        res.end(data)

    //Not found
    }else {
        res.writeHead(404, {
            "Content-type" : "text/html"
        });
        res.end("<h1>Page not found!</h1>");
    }
})

//localhost = 127.0.0.1
server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to request on port 8000")
})
