import http from 'http'
let server = http.createServer(async function (req, res) {
    res.on('error', console.error.bind(console))
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