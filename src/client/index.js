import { createBrowserHistory } from "history"
import makeMatcher from "../share/matcher"

let browserHistory = createBrowserHistory()
window.browserHistory = browserHistory
export default function Client(appSettings) {
    let { routes, root, viewEngine } = appSettings
    let matcher = makeMatcher(routes)

    return {
        start
    }

    function start() {
        let { location } = browserHistory
        let route = matcher(location.pathname)
        let component = getContentString(route)
        viewEngine(component, root)
    }

    function getContentString(route) {
        let { controller } = route
        let Controller = controller.default
        let initObject = new Controller()
        initObject.goTo = goTo
        let component = initObject.init()
        return component
    }

    function goTo(url) {
        browserHistory.push(url)
        start()
        console.log(url)
    }
}

