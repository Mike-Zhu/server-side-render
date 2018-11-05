import routes from './routes'
import ReactDom from 'react-dom'
import Client from "../../../src/index"

let viewEngine = {
    render: (component, container) => {
        return ReactDom.hydrate(component, container)
    }
}


const webpackLoader = async (module) => {
    // let module = await new Promise(loadModule)
    return module.default || module
}

let appSettings = {
    routes: routes,
    viewEngine: viewEngine,
    container: "#container",
    loader: webpackLoader
}

let app = new Client(appSettings)

app.start()