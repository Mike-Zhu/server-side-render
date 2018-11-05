import makeMatcher from "../share/matcher"
import { createLocation } from "history"

export default function createApp(appSettings) {
    let {
        routes,
        viewEngine,
        loader
    } = appSettings
    let matcher = makeMatcher(routes)
    let conponentCache = {}
    return {
        render: render,
    }

    function render(url) {
        let location = createLocation(url)
        let matches = matcher(location.pathname)
        if (!matches) { return }
        let { controller } = matches
        let initComponent = createInitController(location)
        let FinalController = initComponent(controller)
        let component = (new FinalController(location, {})).init()
        return viewEngine(component)
    }


    function createInitController(location) {
        return function (Controller) {
            return getController(location.pathname, Controller)
        }
    }
    function getController(pattern, Controller) {
        if (conponentCache.hasOwnProperty(pattern)) { return conponentCache[pattern] }
        class Wrapper extends Controller {
            constructor(location, context) {
                super(location, context)
                this.location = this.location || location
                this.context = this.context || context
                this.history = history
            }

            goTo(url) {
                history.push(url)
            }
        }
        conponentCache[pattern] = Wrapper
        return Wrapper
    }
}



