# README for Node.js Backend

This README provides an overview of the Node.js backend code and how to set up and run the application. The backend is responsible for handling requests, interacting with a Java API, managing WebSocket connections, connecting to a Eureka server, and establishing a database connection. It also logs various events using Winston and Elasticsearch for debugging, info, and error logging.

## Requirements

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- Elasticsearch
- Eureka Server
- PostgreSQL Database

## Setup

1. Install Node.js and npm from [Node.js website](https://nodejs.org/).
2. Make sure Elasticsearch, Eureka Server, and the PostgreSQL database are running on their respective addresses mentioned in the configuration files.

## Configuration

Use `.env` file located at the root directory.

## Running the Application

1. Clone the repository:
   git clone <repository_url.git>
   cd <repository_directory>
2. Install the required dependencies by running `npm install` in the root directory.
3. Start the backend server by running `npm start`.
4. The backend server will start running on the specified port, and you should see log messages indicating the server is listening.

## API Endpoints

The backend provides the following API endpoints:

1. `/nodeKafka/api`:Handles HTTP requests.

2. `/nodeKafka/kafka`:Handles Kafka responses.

## WebSocket

The backend supports WebSocket connections . Clients can connect to this socket to receive real-time updates about the processing status of their requests.

## Database Connection

The backend establishes a connection to the PostgreSQL database using the configuration in the `db/conn.js` file. The database connection credentials should be provided in the file.

## Logging

The application utilizes custom logging to improve visibility and troubleshoot issues. Logging is configured to store different types of logs for various purposes.The application uses Winston logging library to log events. Logs are stored in Elasticsearch.

## Eureka Server

The backend connects to the Eureka server to register itself and provide service discovery capabilities.
