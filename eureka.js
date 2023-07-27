const Eureka = require("eureka-js-client").Eureka;
const dotenv = require("dotenv");
dotenv.config();

const client = new Eureka({
  instance: {
    app: "node-async",
    instanceId: process.env.instnceID,
    //instanceId should be differant for every user
    hostName: process.env.hostname,
    //hostname should always be your ip address
    ipAddr: process.env.hostname,
    statusPageUrl: `http://${process.env.hostname}:${process.env.port}/nodeKafka`,
    healthCheckUrl: `http://${process.env.hostname}:${process.env.port}/healthcheck`,
    homePageUrl: `http://${process.env.hostname}:${process.env.port}/nodeKafka`,
    port: {
      $: process.env.port,
      "@enabled": "true",
    },
    vipAddress: "node-async",
    //vipaddress should always be same as app name
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    // eureka server host / port
    host: "192.168.2.79",
    port: 8761,
    servicePath: "/eureka/apps/",
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

module.exports = client;
