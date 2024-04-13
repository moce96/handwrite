function myCreate(prototype) {
    const func = function () {

    }
    func.prototype = prototype
    return new func()
}

function myInstanceOf(left, right) {

    let proto = Object.getPrototypeOf(left)
    let protoype = right.prototype
    while (true) {
        if (protoype === null) return true
        if (proto === null) return false
        if (proto === protoype) {
            return true
        }
        proto = Object.getPrototypeOf(proto)
    }
}

function myNew(constructor) {
    if (typeof constructor !== 'function') {
        throw new Error('function')
    }
    const params = [...arguments].slice(1)
    const newObj = Object.create(constructor.prototype)
    let res = constructor.apply(newObj, params)
    return (typeof res === 'object' || typeof res === 'function') ? res : newObj

}
