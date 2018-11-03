import routes from './routes'
import ReactDom from 'react-dom'
import Client from "../../../src/index"

let appSettings = {
    routes: routes,
    viewEngine: ReactDom.hydrate,
    container:"#container"
}

let app = new Client(appSettings)

app.start()