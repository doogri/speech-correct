import OpenAI from "openai";
import dotenv from 'dotenv';


dotenv.config({ 
    path: '.env'
});


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
   });
   
export function splitText(text: string, delimiter: string=''): string[] {
    delimiter ||= 'טיק טיק';
    const listall = text.split(delimiter);
    console.log(listall);
    return listall;
}


export async function processTexts(texts: string[]) {
    const pairs = [];
    for (let i = 0; i < texts.length; i += 2) {
        const text1 = texts[i];
        const text2 = texts[i + 1];
        const pair = {text: text1, instruction: text2};
        pairs.push(pair);
    }

    const results = [];

    for (const pair of pairs) {
        const prompt = `fix the text by the instruction. the text: ${pair.text}. the instruction: ${pair.instruction}`
        const result = await callGpt(prompt);
        results.push(result);
    }


    return results.join('. ');
}

   export async function callGpt(prompt: string) {


     const completion = await openai.chat.completions.create({
       messages: [{ role: 'user', content: prompt }],
       model: 'gpt-4o',
     });
   
     console.log(completion.choices[0].message.content);
     return completion.choices[0].message.content;
   }
   