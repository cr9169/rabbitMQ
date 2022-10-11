import amqplib, { Channel, Connection } from 'amqplib';
import express, { Request, Response } from 'express';
import fs from "fs";

const app = express();

// parse the request body
app.use(express.json());

// port where the service will run
const PORT = 4001;

// rabbitmq to be global variables
let channel: Channel, connection: Connection;

const connect = async (): Promise<void> => {
  try {
    const amqpServer = 'amqp://localhost:5672';
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    // consume all the orders that are not acknowledged
    await channel.consume('post', async (data: amqplib.ConsumeMessage | null) => {
        await handleDataFile("C:/Users/Administrator/Desktop/rabbitMQ/logs.txt", data);
        console.log(`Received ${Buffer.from(data!.content)}`);
    })
  } 
  catch (error) {
    console.error(error);
  }
}

connect();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const handleDataFile = async (filePath: string, data: amqplib.ConsumeMessage | null): Promise<void> => {
    fs.stat(filePath, (exists) => {
        if (exists == null) {
            fs.appendFile(filePath, data!.content.toString() + "\n", (err: NodeJS.ErrnoException | null) => {
                if (err) 
                    console.error("error in writing to file");
                console.log('Saved!');
                });
        } 
        
        else if (exists.code === 'ENOENT') {
            fs.writeFile(filePath, data!.content.toString() + "\n", (err: NodeJS.ErrnoException | null) => {
                if (err) 
                    console.error("error in creating file");
                console.log('Created!');
                });
        }
    });
}
