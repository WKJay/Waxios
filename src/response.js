export default function (xhr) {
    let arr = xhr.getAllResponseHeaders().split('\r\n');
    let headers = {};
    arr.forEach(str => {
        if (!str) {
            return;
        }
        let [name, val] = str.split(': ');
        headers[name] = val;
    })
  
    return {
        ok: true,
        status: xhr.status,
        data: xhr.response,
        xhr,
        headers
    }
}