import Waxios from './waxios';


let waxios1 = Waxios.create({
    transformRequest(config) {
        config.headers.token = 'WKJay';
        return config;
    }
});

waxios1.interceptors.request.use(function (config) {
    config.headers.i = 999999;
    return config;
});

// waxios1.interceptors.response.use(function (resp) {
//     resp.data.a = 12;
//     return resp;
// });

// let waxios2 = Waxios.create({
//     baseUrl: "http://192.168.1.101"
// })

// Waxios('data/1.json', {
//     baseUrl: 'a/b/../cgi-bin/',
//     headers: {
//         a: 12
//     }
// })
(async () => {
    let data = await waxios1('data/1.json', {
        headers: {
            a: 12,
            b: 6
        }
    });
    console.log(data);
})();



// Waxios.get('1.json');
// let form = new FormData()
// Waxios.post('/reboot', form);