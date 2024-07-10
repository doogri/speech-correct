import express from 'express';
import path from 'path';
import { fromReadStreamToText } from '.';
import fs from 'fs';
import { Buffer } from 'buffer';
import os from 'os';


const app = express();

// Set the path to the built React app (locally)
const reactBuildPath = path.join(__dirname, '../../correct-client/build');

// Serve static files from the React build directory
app.use(express.static(reactBuildPath));
app.use(express.text());
app.use(express.raw({ type: 'audio/webm', limit: '50mb', }));

app.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});

app.post('/upload-audio', async (req, res) => { 
    const audio = fromBufferToReadStream(req.body);
    const result = await fromReadStreamToText(audio);
    res.send(result).status(200);
});

function fromBufferToReadStream(body: Buffer) {
    // todo - find a way to do the same without writing to file
    const audioBuffer: Buffer = body;
    const tempFilePath = path.join(os.tmpdir(), 'temp.webm');
    fs.writeFileSync(tempFilePath, audioBuffer);
    const audio = fs.createReadStream(tempFilePath);
    return audio;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


