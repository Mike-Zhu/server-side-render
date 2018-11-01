import http from 'http'
import fs from 'fs'
import path from 'path'
import { renderToString } from 'react-dom/server'
import routes from './src/routes'
import createApp from '../../src/server'

let indexFile = fs.readFileSync(path.join(__dirname, './index.html')).toString()
let appSettings = {
    routes: routes
}

let app = createApp(appSettings)

let server = http.createServer(async function (req, res) {
    res.on('error', console.error.bind(console))
    if (req.url === "/favicon.ico") {
        res.writeHeader(200, {
            'Content-Type': 'text/html'
        })
        let html = render(12)
        res.end(html)
        return
    }
    let url = req.url

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