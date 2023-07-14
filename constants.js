const Constants = {
    status: {
        success: 200,
        badRequest: 400,
        notFound: 404,
        serverError: 500,
    },
    message: {
        webSocketConnect: "Websocket connected",
        webSocketDisconnect: "Websocket disconnected",
        webSocketError: "error in connecting Websocket",
        requestreceived: "request received",
        responseSend: "response send to user",
        success: "resquest sent successfully",
        processStart: "process started",
        processComplete: "process completed",
        badRequest: "Request had bad syntax or was impossible to fulfill",
        serverError: "can not connect to server",
    },
};

module.exports = Constants;