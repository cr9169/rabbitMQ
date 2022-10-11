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
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = config_1.config.SECOND_SERVICE_PORT;
const amqpServer = config_1.config.AMQP_SERVER_URI;
let channel, connection;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        connection = yield amqplib_1.default.connect(amqpServer);
        channel = yield connection.createChannel();
        yield channel.consume('post', (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield handleDataFile("C:/Users/Administrator/Desktop/rabbitMQ/logs.txt", data);
            console.log(`Received ${Buffer.from(data.content)}`);
        }));
    }
    catch (error) {
        console.error(error);
    }
});
connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});
const handleDataFile = (filePath, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        fs_1.default.appendFile(filePath, data.content.toString() + "\n", (err) => {
            console.log('Saved!');
        });
    }
    catch (error) {
        console.error("Can't write to file!");
    }
});
//# sourceMappingURL=second-service.js.map