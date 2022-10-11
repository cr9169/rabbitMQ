import amqplib, { Channel, Connection } from 'amqplib';
import express, { Request, Response } from "express";
import { config } from './config';

const app = express();

app.use(express.json());

const PORT = config.FIRST_SERVICE_PORT;
const amqpServer = config.AMQP_SERVER_URI;

let channel: Channel, connection: Connection;

const connectRabbitMq = async (): Promise<void> => {

  try {
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('post');
  } 

  catch (error) {
    console.error(error);
  }

}

connectRabbitMq().then(() => { 
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});;

app.post('/posts', (req: Request, res: Response) => {

  const data = req.body;

  channel.sendToQueue('post',
    Buffer.from(
      JSON.stringify({
        ...data,
      }),
    ),
  );

  res.send('Post submitted');
});































// const msg: Object = {request: ""};

// const connect = async() => {

//     const connection: Connection = await client.connect(
//         'amqp://localhost:15672');


//     // Create a channel
//     const channel: Channel = await connection.createChannel();
//     // Makes the queue available to the client
//     await channel.assertQueue('requests');
//     //Send a message to the queue
//     channel.sendToQueue('requests', Buffer.from('message'));

// }

// connect();