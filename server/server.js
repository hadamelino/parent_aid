import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import generateStory from "./geminiService.js"

dotenv.config();

const app = express(); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static("public"));

app.use(
    cors({
        origin: "http://localhost:3000"
    })
)

app.post("/synthesize", async (req, res) => {
    const text = req.body.text;
    const openai = new OpenAI( { apiKey: process.env.OPEN_AI_API_KEY, dangerouslyAllowBrowser: true} );
    const speechFile = path.resolve("./public/speech.mp3");
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
    });
    // console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    console.log("Buffering...")
    console.log(buffer);
    await fs.promises.writeFile(speechFile, buffer);
    res.send({update: true});
})

app.post("/generateStory", async (req, res) => {
    const moral = req.body.moral;
    const result = await generateStory(moral);
    res.json({story: result});
})

const port = 3001
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
})
