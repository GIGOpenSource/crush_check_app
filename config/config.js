// 开发中？
const develop = true
// http://192.168.77.222:8000/api
// https://www.liangstart.online/api	
// https://www.crashcheck.net/api
let host = 'http://192.168.77.222:8000/api';
if (develop) host = 'http://192.168.77.222:8000/api'; 
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}

