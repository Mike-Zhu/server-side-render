import { createBrowserHistory, createLocation } from "history"
import makeMatcher from "../share/matcher"
import defaultSettings from "../share/constant"
import * as _ from "../share/util"

let history = createBrowserHistory()
window.browserhistory = history
export default function Client(appSettings) {
    let finalSettings = _.extend(defaultSettings, appSettings)
    let {
        routes,
        container,
        viewEngine,
        context
    } = finalSettings
    let root = document.querySelector(container)
    let matcher = makeMatcher(routes)

    context = {
        ...context,
        ...appSettings.context
    }

    let currentLocation = null
    let currentController = null
    let unlisten = undefined
    let conponentCache = {}
    return {
        start,
        stop
    }

    function stop() {
        unlisten()
    }

    function start() {
        let listener = function (location, action) {
            let result = render(location)
        }
        unlisten = history.listen(listener);
    }

    function render(tagetPath) {
        let location = typeof tagetPath === "string" ? createLocation(tagetPath) : location
        context.preLocation = currentLocation
        currentLocation = location

        let matches = matcher(location.pathname)
        if (!matches) {
            throw new Error('404')
        }
        let { path, controller, params } = matches

        //强化location对象
        location.pattern = path
        location.params = params
        location.raw = location.pathname + location.search

        let initController = createInitController(location)

        let { controller } = matches
        let Controller = controller.default
        let initObject = new Controller()
        initObject.goTo = goTo
        let component = initObject.init()
        return component
    }

    function createInitController(location) {
        //这里的hoc主要是为了缓存
        return function (Controller) {
            if (currentLocation !== location) { return }
            detroyController()
            let controller = currentController = getControllerFromCache(location)
            let component
            if (controller) {

            } else {
                controller = gerController(location.pattern, Controller)
            }
        }
    }

    function gerController(pattern, Controller) {
        if (conponentCache.hasOwnProperty(pattern)) { return conponentCache[pattern] }
        class Wrapper extends Controller{

        }
        conponentCache[pattern] = Wrapper
        return Wrapper
    }
    function goTo(url) {
        history.push(url)
        console.log(url)
    }

    function detroyController() {

    }
}

