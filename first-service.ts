import amqplib, { Channel, Connection } from 'amqplib';
import express, { Request, Response } from "express";

const app = express();

// parse the request body
app.use(express.json());

// port where the service will run
const PORT = 4000;

// rabbitmq to be global variables
let channel: Channel, connection: Connection;

// connect to rabbitmq
const connect = async (): Promise<void> => {

  try {
    // rabbitmq default port is 5672
    const amqpServer = 'amqp://localhost:5672';
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    // make sure that the order channel is created, if not this statement will create it
    await channel.assertQueue('post');
  } 

  catch (error) {
    console.error(error);
  }

}

connect();

app.post('/posts', (req: Request, res: Response) => {

  const data = req.body;

  // send a message to all the services connected to 'order' queue, add the date to differentiate between them
  channel.sendToQueue('post',
    Buffer.from(
      JSON.stringify({
        ...data,
      }),
    ),
  );

  res.send('Post submitted');
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
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