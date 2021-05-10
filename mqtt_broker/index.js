let aedes = require("aedes");
const port = 1883;

const aedesOptions = {
    authenticate: (client, username, password, cb) => {
        if (
            username &
            typeof username === "string" &&
            username === "georgiy"
        ) {
            if (
                password &&
                typeof password === "object" &&
                password.toString() === "123"
            ) {
                cb(null, true);
                console.log(`Client: ${client} authenticated successfully`);
            }
        } else {
            cb(false, false);
        }
    },
};

broker = aedes(aedesOptions);
// broker = aedes();
const server = require("net").createServer(broker.handle);

server.listen(port, function () {
    console.log("server started and listening on port ", port);
});

broker.on("client", (client) => {
    console.log("Client connected", broker.connectedClients);
});

broker.on("subscribe", (subscriptions, client) => {
    console.log(subscriptions);
});
