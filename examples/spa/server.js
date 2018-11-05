import http from 'http'
import fs from 'fs'
import path from 'path'
import { renderToString } from 'react-dom/server'
import routes from './src/routes'
import createApp from '../../src/server'

let indexFile = fs.readFileSync(path.join(__dirname, './index.html')).toString()
let appSettings = {
    routes: routes,
    viewEngine,
    loader: value => value.default || value
}

function viewEngine(component) {
    return renderToString(component)
}

let app = createApp(appSettings)

let server = http.createServer(async function (req, res) {
    res.on('error', console.error.bind(console))
    let url = req.url
    console.log(url)
    if (url === "/favicon.ico") {
        res.writeHeader(200, {
            'Content-Type': 'text/html'
        })
        let html = render(12)
        res.end(html)
        return
    }

    if (/\.js/.test(url)) {
        res.writeHead(200, {
            'Content-Type': 'text/javascript'
        })
        let file = path.join(__dirname, url)
        readFile(file).pipe(res)
        return
    }

    let content = app.render(url)
    res.writeHeader(200, {
        'Content-Type': 'text/html'
    })
    let html = render(content)
    res.end(html)
})

let basename = "/examples/spa"
let port = 3002
server.listen(port)
console.log(`server start at ${port}`)


function render(content) {
    return indexFile.replace(
        `<div id="container"></div>`,
        `<div id="container">${content}</div>`
    )
}

function readFile(file) {
    return fs.createReadStream(file)
}