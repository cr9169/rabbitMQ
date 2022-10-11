import amqplib, { Channel, Connection } from 'amqplib';
import express from 'express';
import fs from "fs";
import { config } from './config';

const app = express();

app.use(express.json());

const PORT = config.SECOND_SERVICE_PORT;
const amqpServer = config.AMQP_SERVER_URI;

let channel: Channel, connection: Connection;

const connect = async (): Promise<void> => {
  try {
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    await channel.consume('post', async (data: amqplib.ConsumeMessage | null) => {
        await handleDataFile(config.DATA_FILE_PATH, data); // TODO: save path file as const
        console.log(`Received ${Buffer.from(data!.content)}`);
    })
  } 
  catch (error) {
    console.error(error);
  }
}

connect().then(() => { 
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});

const handleDataFile = async (filePath: string, data: amqplib.ConsumeMessage | null): Promise<void> => {
    
    try { 
        fs.appendFile(filePath, data!.content.toString() + "\n", (err: NodeJS.ErrnoException | null) => {
            console.log('Saved!');
        });
    }
    catch(error) {
        console.error("Can't write to file!");
    }

} 
