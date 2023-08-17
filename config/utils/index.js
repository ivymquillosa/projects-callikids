
const createProxy = (object, handler, generator = false) => {
    let prototypes = Object.getOwnPropertyNames(Object.getPrototypeOf(object))

    if(generator)
        return prototypes.reduce((obj, key) => {
            obj[key] = new Proxy(co(object[key]), Object.assign({
                class: object.constructor.name,
                prototype: key
            }, handler))

            return obj
        }, {})		
    else
        return prototypes.reduce((obj, key) => {
            obj[key] = new Proxy(object[key], Object.assign({
                class: object.constructor.name,
                prototype: key
            }, handler))

            return obj
        }, {})
}

module.exports = {
    createProxy
}