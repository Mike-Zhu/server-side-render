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
        let { controller: Controller, path, params } = matches

        //强化location对象
        location.pattern = path
        location.params = params
        location.raw = location.pathname + location.search

        let initComponent = createInitController(location)
        Controller = loader(Controller)
        let FinalController = initComponent(Controller)
        let controller = new FinalController(location, {})
        let component = controller.init()
        return viewEngine(component)
    }


    function createInitController(location) {
        return function (Controller) {
            return getController(location.pathname, Controller)
        }
    }
    function getController(pattern, Controller) {
        console.log(Controller)
        if (conponentCache.hasOwnProperty(pattern)) { return conponentCache[pattern] }
        class Wrapper extends Controller {
            constructor(location, context) {
                super(location, context)
                this.location = this.location || location
                this.context = this.context || context
            }
        }
        conponentCache[pattern] = Wrapper
        return Wrapper
    }
}



