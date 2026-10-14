import Redis from "ioredis";
import express from "express";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL||"redis://localhost:6379")

const BINARY_KEY = "app:banner";

app.post("/banner", async (req, res) => {
    await redis.set(BINARY_KEY, req.body.message || "Welcome friends, chai pee lo")
    res.json({
        success : true
    })

})

app.get("/banner", async (req, res) => {
    await redis.get(BINARY_KEY)
    res.json({
        success : true
    })
})

app.delete("/banner", async (req, res) => {
    await redis.del(BINARY_KEY)
    res.json({
        success : true
    })
})

app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BINARY_KEY)
    res.json({
        success : Boolean(exists)
    })
})

app.listen(3000, ()=>{
    console.log("server is up and runnning at 3000")
})
