import express from "express"
import Redis from "ioredis"


const app = express();

app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

function getPostKey (postId) {
    return `post:${postId}:count`;
}
function getUserKey (user) {
    return `user:${user}:score`;
}

const LEADERBOARD_KEY = "leaderboard:scores"


app.post("/post/:postId/add", async(req, res)=>{
    const {postId} = req.params
    const totalHits = await redis.incr(getPostKey(postId)) //redis inbuilt incr fucntion

    res.json({
        success: true,
        totalHits
    })
})

app.post("/user/score", async(req, res)=>{
    const {user, score} = req.body

    const points = await redis.zincrby(LEADERBOARD_KEY, score, user)

    res.json({
        success: true,
        points
    })
})


app.get("/leaderBoard/:top", async(req, res)=>{
    const {top} = req.params
    const board = await redis.zrevrange(LEADERBOARD_KEY, 0, top -1)

    res.json({
        success: true,
        board
    })
})

app.get("/user/:user/rank", async(req, res)=>{
    const {user} = req.params
    const rank = await redis.zrevrank(LEADERBOARD_KEY, user)

    res.json({
        success: true,
        rank
    })
})



app.listen(3000, () => {
    console.log("server is up and running on 3000");
})