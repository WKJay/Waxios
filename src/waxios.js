import defaultOptions from './default'
import request from './request'
import {
    merge,
    assert,
    clone
} from './common'
import createResponse from './response'
import createError from './error'
import Interceptors from './interceptors'

const urlLib = require('url');

class Waxios {
    constructor() {
        let _this = this;
        this.interceptors = {
            request: new Interceptors(),
            response: new Interceptors()
        };
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
                return _this.request(options);
            }
        });
    };

    request(options) {
        let _headers = this.default.headers;
        delete this.default.headers;

        let result = clone(this.default);
        merge(result, this.default);
        merge(result, options);
        this.default.headers = _headers;
        options = result;

        //合并头
        let headers = {};
        merge(headers, this.default.headers.common);
        merge(headers, this.default.headers[options.method.toLowerCase()]);

        merge(headers, options.headers);
        options.headers = headers;

        //2.检测参数合法性
        checkOptions(options);

        //3.合并baseURL
        //options.url = options.baseUrl + options.url;
        options.url = urlLib.resolve(options.baseUrl, options.url);
        delete options.baseUrl;

        //4.变换请求
        const {
            transformRequest,
            transformResponse
        } = options;

        delete options.transformRequest;
        delete options.transformResponse;
        options = transformRequest(options);

        checkOptions(options);

        let list = this.interceptors.request.list();
        list.forEach(fn => {
            options = fn(options);
            checkOptions(options);
        });


        //5.调用request
        return new Promise((resolve, reject) => {
            //包装结果/错误信息
            request(options).then(xhr => {
                let res = createResponse(xhr);
                res.data = transformResponse(res.data);

                let list = this.interceptors.response.list();
                list.forEach(fn => {
                    res = fn(res);
                });
                resolve(res);
            }, xhr => {
                let res = createError(xhr);
                reject(res);
            });
        });

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
        return this.request(options);
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
        return this.request(options);
    }
};

Waxios.create = Waxios.prototype.create = function (options) {
    let waxios = new Waxios();
    let res = clone(defaultOptions);

    merge(res, options);

    waxios.default = res;


    return waxios;
}

function checkOptions(options) {
    assert(options, 'options is required');
    assert(options.method, 'no method');
    assert(options.url, 'no url');
}

export default Waxios.create();