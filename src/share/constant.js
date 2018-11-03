const isClient = typeof window !== undefined
const isServer = !isClient

export default {
    context:{
        isClient,
        isServer
    },
    basename:"",
    containr:"#container",
}