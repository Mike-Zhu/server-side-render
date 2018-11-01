import * as _ from "../share/util"
import pathToRegexp from 'path-to-regexp'

export default function createApp(appSettings) {
    let routes = appSettings
    let matcher = makeMatcher(routes)
    return {
        render: render
    }
    function render(url) {
        return "1231"
    }
}

function makeMatcher(routes) {
    if (!_.isArray(routes)) routes = [routes]
    let finalRoutes = routes.map(createRoute)
    console.log(finalRoutes)
    return function matcher(url) {
        let cleanUrl = cleanPath(url)
        for (let i = 0; i < routes.length; i++) {
            let route = routes[i]
            // let matches = 
            // if (route.path !== cleanUrl) {
            //     continue
            // }
            return route.controller
        }
    }
}

function createRoute(route) {
    let finalRoute = _.extend({}, route)
    let keys = finalRoute.keys = []
    finalRoute.regexp = pathToRegexp(finalRoute.path, keys)
    return finalRoute
}

function cleanPath(path) {
    return path.replace(/\/\//g, '/')
}