import { createBrowserHistory } from "history"
import makeMatcher from "../share/matcher"
import defaultSettings from "../share/constant"
import * as _ from "../share/util"

let browserHistory = createBrowserHistory()
window.browserHistory = browserHistory
export default function Client(appSettings) {
    let finalSettings = _.extend(defaultSettings, appSettings)
    let { routes, container, viewEngine } = finalSettings
    let root = document.querySelector(container)
    let matcher = makeMatcher(routes)

    return {
        start
    }

    function start() {
        const unlisten = browserHistory.listen((location, action) => {
            // location is an object like window.location
            console.log("actions")
            let component = getComponent(location)
            viewEngine(component, root)
            console.log(action, location, location.state);
        });

        let { location } = browserHistory
        let component = getComponent(location)
        viewEngine(component, root)
    }

    function getComponent(location) {
        let route = matcher(location.pathname)
        let { controller } = route
        let Controller = controller.default
        let initObject = new Controller()
        initObject.goTo = goTo
        let component = initObject.init()
        return component
    }

    function goTo(url) {
        browserHistory.push(url)
        console.log(url)
    }
}

