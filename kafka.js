// const kafka = require('kafka-node');
// const kafkaHost = 'localhost:9092'; // Replace with the appropriate Kafka broker hostname and port
// const client = new kafka.KafkaClient({ kafkaHost });
// // const io = require('./app');
// // const socketPort = 4000;
// // require('./socket')

// // Function to process Kafka messages
// const consumer = new kafka.Consumer(client, [{ topic: 'process-over' }]);

// // Listen to Kafka messages
// consumer.on('message', async (message) => {
//     const processNotification = message.value;
//     console.log(processNotification, "abcdefg");
//     global.io.emit('processNotification', processNotification);
// });


