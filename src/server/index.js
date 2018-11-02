import makeMatcher from "../share/matcher"

export default function createApp(appSettings) {
    let { routes, viewEngine } = appSettings
    let matcher = makeMatcher(routes)

    return {
        render: render,
    }

    function render(url) {
        let route = matcher(url)
        let contentString = getContentString(route)
        return contentString
    }

    function getContentString(route) {
        let { controller } = route
        let Controller = controller.default
        let initObject = new Controller()
        let component = initObject.init()
        return viewEngine(component)
    }
}



