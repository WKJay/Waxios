import defaultOptions from './default'
import request from './request'
import {
    merge,
    assert
} from './common'

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
                let options = _this._preprocessArgs(undefined, args);
                if (!options) {
                    if (args.length == 2) {
                        //get(url)
                        assert(typeof args[0] == 'string', 'args[0] must be  string');
                        //get(url,{params:{},headers:{}})
                        assert(typeof args[1] == 'object' && args[1] && args[1].constructor == Object, 'args[1] must be json');
                        options = {
                            ...args[1],
                            url: args[0],
                            method: 'get'
                        }
                    } else {
                        assert(false, 'invalid arguments');
                    }
                }
                _this.request(options);
            }
        });
    }

    request(options) {
        let _headers = this.default.headers;
        delete this.default.headers;

        merge(options, this.default);
        this.default.headers = _headers;

        //合并头
        let headers = {};
        merge(headers, this.default.headers.common);
        merge(headers, this.default.headers[options.method.toLowerCase()]);

        merge(headers, options.headers);
        options.headers = headers;

        //2.检测参数合法性
        assert(options.method, 'no method');
        assert(options.url, 'no url');

        //3.合并baseURL
        options.url = options.baseUrl + options.url;
        delete options.baseUrl;

        //4.调用request
        request(options);
    }

    _preprocessArgs(method, args) {
        let options;
        if (args.length == 1 && typeof args[0] == 'string') {
            options = {
                method,
                url: args[0]
            };
        } else if (args.length == 1 && args[0].constructor == Object) {
            options = {
                ...args[0],
                method
            };
        } else {
            return undefined;
        }
        return options;
    }

    get(...args) {
        let options = this._preprocessArgs('get', args);
        if (!options) {
            if (args.length == 2) {
                //get(url)
                assert(typeof args[0] == 'string', 'args[0] must be  string');
                //get(url,{params:{},headers:{}})
                assert(typeof args[1] == 'object' && args[1] && args[1].constructor == Object, 'args[1] must be json');
                options = {
                    ...args[1],
                    url: args[0],
                    method: 'get'
                }
            } else {
                assert(false, 'invalid arguments');
            }
        }
        this.request(options);
    }

    post(...args) {
        let options = this._preprocessArgs('post', args);
        if (!options) {
            if (args.length == 2) {
                //post(url,{a:12,b:5})
                assert(typeof args[0] == 'string', 'args[0] must be string');
                options = {
                    url: args[0],
                    data: args[1],
                    method: 'post'
                }
            } else if (args.length == 3) {
                assert(typeof args[0] == 'string', 'args[0] must be string');
                assert(typeof args[2] == 'object' && args[2] && args[2].constructor == Object, 'args[2] must be json');
                options = {
                    ...args[2],
                    url: args[0],
                    data: args[1],
                    method: 'post'
                }
            } else {
                assert(false, "invalid arguments");
            }
        }
        this.request(options);
    }
}
Waxios.create = Waxios.prototype.create = function (options) {
    let waxios = new Waxios();

    let res = {
        ...JSON.parse(JSON.stringify(defaultOptions))
    };

    merge(res, options);
    waxios.default = res;
    return waxios;
}

export default Waxios.create();