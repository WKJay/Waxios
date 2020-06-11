import Waxios from './waxios'


// let waxios = Waxios.create({
//     baseUrl: "http://10.2.5.138",
//     headers: {
//         common: {
//             a: 12
//         }
//     }
// })


// let waxios2 = Waxios.create({
//     baseUrl: "http://192.168.1.101"
// })

Waxios('data/1.json', {
    baseUrl: '/cgi-bin/',
    headers: {
        a: 12
    }
})

// Waxios.get('1.json');
// let form = new FormData()
// Waxios.post('/reboot', form);