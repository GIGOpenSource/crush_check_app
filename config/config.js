// 开发中？
const develop = true
// http://192.168.77.222:8000/api
// https://www.liangstart.online/api	
let host = 'https://www.crashcheck.net/api';
if (develop) host = 'https://www.crashcheck.net/api'; 
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
