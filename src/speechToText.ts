import fs from "fs";
import OpenAI from "openai";
import dotenv from 'dotenv';
import { Uploadable } from "openai/uploads";


dotenv.config({ 
    path: '.env'
});


const openai = new OpenAI();

export async function convert() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(process.env.soundFile || ''),
    model: "whisper-1",
  });

  console.log(transcription.text);
}

export async function convertReadStream(audio: Uploadable) {
    const transcription = await openai.audio.transcriptions.create({
        file: audio,
        model: "whisper-1",
    });

    return transcription.text;
}
  

if (require.main === module) {
    convert();
}

