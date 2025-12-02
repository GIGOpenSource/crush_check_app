// 开发中？
const develop = true
// http://192.168.77.222:8000/api
// https://www.liangstart.online/api	
let host = 'https://www.liangstart.online/api';
if (develop) host = 'https://www.liangstart.online/api'; 
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
// apk 签名：40fa8052a2655bbe8b1ec536e9dd276f  包名 crush.check 密钥：admin123
//ios Bundle ID：com.geometry.pulseage.healthwatchapp.WatchWidget 密钥：admin123
 
