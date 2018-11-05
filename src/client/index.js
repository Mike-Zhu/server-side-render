import { createBrowserHistory, createLocation } from "history"
import makeMatcher from "../share/matcher"
import defaultSettings from "../share/constant"
import * as _ from "../share/util"


export default function Client(appSettings) {
    let finalSettings = _.extend(defaultSettings, appSettings)
    let {
        routes,
        container,
        viewEngine,
        loader,
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
    let finalContainer = null

    let history = createBrowserHistory()
    window.browserhistory = history

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
        listener(history.location)
    }

    function render(tagetPath) {
        let location = typeof tagetPath === "string" ? createLocation(tagetPath) : tagetPath
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
        let Controller = loader(controller, location, context)
        if (_.isPromise(Controller)) {
            Controller.then(initController)
        } else {
            initController(Controller)
        }
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
                let FinalController = getController(location.pattern, Controller)
                controller = currentController = new FinalController(location, context)
                component = controller.init()
            }
            return renderToContainer(component)
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

    function getControllerFromCache(location) {

    }

    function detroyController() {

    }

    function renderToContainer(component) {
        return viewEngine.render(component, getContainer())
    }

    function getContainer() {
        if (finalContainer) return finalContainer
        if (typeof container === "string") {
            return finalContainer = document.querySelector(container)
        } else {
            return finalContainer = container
        }
    }

    function clearContainer() {
        finalContainer = null
    }
}

