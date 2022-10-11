"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./errorHandler");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(errorHandler_1.errorHandler);
const PORT = config_1.config.FIRST_SERVICE_PORT;
const amqpServer = config_1.config.AMQP_SERVER_URI;
let channel, connection;
const connectRabbitMq = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        connection = yield amqplib_1.default.connect(amqpServer);
        channel = yield connection.createChannel();
        yield channel.assertQueue('post');
    }
    catch (error) {
        console.error(error);
    }
});
connectRabbitMq().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});
;
app.post('/posts', (req, res) => {
    const data = req.body;
    channel.sendToQueue('post', Buffer.from(JSON.stringify(Object.assign({}, data))));
    res.send('Post submitted');
});
//# sourceMappingURL=first-service.js.map