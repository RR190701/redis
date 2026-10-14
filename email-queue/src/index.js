import express from "express"
import Redis from "ioredis"


const app = express()

app.use(express.json())


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")


const QUEUE_KEY= "queue:emails";


app.post("/emails", async (req, res) =>{
    const {userId} = req.params

    await redis.lpush(QUEUE_KEY, JSON.stringify(req.body)) //left push
    res.status(200).json({
        success : true
    })
})

app.get("/email/process-one", async (req, res) =>{
    const {userId} = req.params

    const email = await redis.rpop(QUEUE_KEY);
    res.status(200).json({
        success : true,
        email: email ? JSON.parse(email) : null
    })
})


app.listen(3000, () => {
    console.log("server is up and running on 3000")
})