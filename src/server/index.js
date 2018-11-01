import * as _ from "../share/util"
import pathToRegexp from 'path-to-regexp'

export default function createApp(appSettings) {
    let routes = appSettings.routes
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
            let matches = route.regexp.exec(cleanUrl)
            if (!matches) { continue }
            let params = getParams(matches, route.keys)

            return {
                path: route.path,
                controller: route.controller,
                params
            }
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

function getParams(matches, keys) {
    let params = {}
    for (let i = 1, len = matches.length; i < len; i++) {
        let key = keys[i - 1]
        if (key) {
            if (typeof matches[i] === 'string') {
                params[key.name] = decodeURIComponent(matches[i])
            } else {
                params[key.name] = matches[i]
            }
        }
    }
    return params
}