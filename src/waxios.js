function request() {

}

const _default = {
    method: 'get',
    headers: {
        common: {
            'X-Request-By': 'XMLHttpRequest',
        },
        get: {},
        post: {}
    }
}

class Waxios {
    constructor() {
        let _this = this;
        return new Proxy(request, {
            get(data, name) {
                return _this[name];
            },
            set(data, name, val) {
                _this[name] = val;
                return true;
            },
            apply(fn, thisArg, args) {

            }
        });
    }

    get() {
        alert('get');
    }

    post() {
        alert('post');
    }
}
Waxios.create = Waxios.prototype.create = function () {
    let waxios = new Waxios();
    waxios.default = JSON.parse(JSON.stringify(_default));
    return waxios;
}

export default Waxios.create();