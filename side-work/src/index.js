import mongoose from "mongoose";
import Redis from "ioredis";
import express from "express";

const app = express()

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/mongodb"

app.get("/redis", async(req, res) => {
    const reply = await redis.ping();
    res.json({
       redis:reply
    })
})

app.get("/mongo", async(req, res) => {
    if (mongoose.connection.readyState === 0){
        await mongoose.connect(mongoUrl)

    }
    res.json({
        mongo : "connected",
        db_name: mongoose.connection.name
    })
})

app.listen(3000, () => {
    console.log(`server is up and running from on port 3000`);
})