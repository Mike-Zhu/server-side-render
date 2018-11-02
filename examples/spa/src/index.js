import routes from './routes'
import ReactDom from 'react-dom'
import Client from "../../../src/index"

let root = document.getElementById("container")
let appSettings = {
    routes: routes,
    viewEngine: ReactDom.hydrate,
    root
}

let app = new Client(appSettings)

app.start()