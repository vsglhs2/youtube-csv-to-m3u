function createProxy() {
    return new Proxy(function () {}, {
        apply(...args) {
            console.log(args);

            return createProxy();
        },
        get(...args) {
            console.log(args);

            return createProxy();
        }, 
        set(...args) {
            console.log(args);
        },
    });
}

module.exports = {
    createProxy,
};
