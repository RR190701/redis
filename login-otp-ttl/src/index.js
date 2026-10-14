import express from "express"
import Redis from "ioredis"


const app = express()
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

app.use(express.json())

function otpKey(phone){
    return `otp:${phone}`;
}


app.post("/otp", async (req, res) => {
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random() *900000).toString()
    await redis.set(otpKey(phone), otp, 'EX', 30) //30 seconds
    res.json({
        otp
    })
});

app.get("/otp/:phone/ttl", async (req, res) => {
    const {phone} = req.params;
    const ttl = await redis.ttl(otpKey(phone))
    res.json({
        ttl
    })
});

app.post("/otp/verify", async (req, res) => {

    const {phone, otp} = req.body;

    const savedOtp = await redis.get(otpKey(phone))
    if(!savedOtp){
        res.status(400).json({
            error : "OTP expired"
        })
    }
    else if(savedOtp != otp){
        res.status(400).json({
            error: "OTP is not correct"
        })
    }
    await redis.del(otpKey(phone))
    res.json({
        success: "OTP verified"
    })
});

app.listen(3000, () => {
    console.log("App is up is running on 3000")
})