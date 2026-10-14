import express from "express"
import Redis from "ioredis"


const app = express()

app.use(express.json())


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")
function getUserKey(userId) {
    return `user:${userId}`;
}


app.post("/user/:userId/set", async (req, res) =>{
    const {userId} = req.params

    await redis.set(getUserKey(userId), JSON.stringify(req.body))
    res.status(200).json({
        success : true
    })
})
app.delete("/user/:userId/set", async (req, res) =>{
    const {userId} = req.params

    await redis.del(getUserKey(userId))
    res.status(200).json({
        success : true
    })
})

app.get("/user/:userId/set", async (req, res) =>{
    const {userId} = req.params

    const user = await redis.get(getUserKey(userId))
    res.status(200).json({
     user : (user ? JSON.parse(user) : null)
    })
})

app.post("/user/:userId/hset", async (req, res) =>{
    const {userId} = req.params

    await redis.hset(getUserKey(userId), req.body)
    res.status(200).json({
        success : true
    })
})


app.get("/user/:userId/hset", async (req, res) =>{
    const {userId} = req.params

    const user = await redis.hgetall(getUserKey(userId))
    res.status(200).json({
        user
    })
})



app.listen(3000, () => {
    console.log("server is up and running on 3000")
})