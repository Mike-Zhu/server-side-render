import routes from './routes'
import ReactDom from 'react-dom'
import Client from "../../../src/index"

let viewEngine = {
    render:(component,container) => {
        return ReactDom.hydrate(component,container)
    }
}
let appSettings = {
    routes: routes,
    viewEngine: viewEngine,
    container:"#container"
}

let app = new Client(appSettings)

app.start()