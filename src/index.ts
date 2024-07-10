import axios from 'axios';
import dotenv from 'dotenv';
import { processTexts, splitText } from './gptService';
import fs from 'fs';
import { convertReadStream } from './speechToText';

dotenv.config({ 
    path: '.env'
});



async function sendTextToGPT(text: string, instructions: string): Promise<string> {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: text,
        instructions: instructions,
        max_tokens: 100,
        temperature: 0.7,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
    });

    return response.data.choices[0].text;
}



export function getTextAndInstructions(): { text: string, instructions: string } {
    //const text = 'The quick brown fox jumps over the lazy dog';
    //const instructions = 'change the word dog to be capitalized and the word fox to be wolf';
    //return { text, instructions };

    const a = { text: 'The quick brown fox jumps over the lazy dog and it woke up the cas',
                instructions: 'change the last s letter to t' 
            }

            const b= { text: 'שלום מה נשמע סימן שאלה',
                instructions: 'במקום המילים סימן שאלה פשוט תוסיף סימן שאלה' 
            }
            return { 
                text: process.env.text || '',
                instructions: process.env.instructions || ''
            }
}

async function getTextFromSpeechToText(): Promise<string|null> {
    const audio = fs.createReadStream(process.env.soundFile || '');
    return await fromReadStreamToText(audio);
}

export async function fromReadStreamToText(audio: fs.ReadStream) {
    const theText = await convertReadStream(audio);

    const textAndInstructions = splitText(theText);
    const result = await processTexts(textAndInstructions);
    return result;
}

async function main() {
    try {
        const text = await getTextFromSpeechToText();
        console.log(text);
        

    } catch (error) {
        console.error('Error:', error);
    }
}

if (require.main === module) {
    main();
}
