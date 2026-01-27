// 开发中？
const develop = true
// http://192.168.77.54:8000/api	
// https://www.crashcheck.net/api
let host = 'https://www.crashcheck.net/api';
if (develop) host = 'https://www.crashcheck.net/api'; 
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

// 广告位ID配置
// 注意：请在小程序后台配置正确的广告位ID
const adPid = '1213639316'; // 激励视频广告位ID

export {
	host,
	adPid
}

