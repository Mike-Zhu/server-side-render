export const isArray = Array.isArray

export const extend = Object.assign

export function isPromise(data) {
    let then = data && data.then
    return typeof then === "function"
}