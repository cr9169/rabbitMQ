import client, {Channel, Connection} from "amqplib";

const msg: Object = {request: ""};

const connect = async() => {

    const connection: Connection = await client.connect(
        'amqp://localhost:5672');


    // Create a channel
    const channel: Channel = await connection.createChannel();
    // Makes the queue available to the client
    await channel.assertQueue('requests');
    //Send a message to the queue
    channel.sendToQueue('requests', Buffer.from('message'));

}

connect();