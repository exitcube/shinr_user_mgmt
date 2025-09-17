const crypto = require("crypto");

let OtpGenerator=():String=>{

    return String(crypto.randomInt(0, 10000)).padStart(4, '0');
} 
export default OtpGenerator;