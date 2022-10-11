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
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 4001;
let channel, connection;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amqpServer = 'amqp://localhost:5672';
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
connect();
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
const handleDataFile = (filePath, data) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.stat(filePath, (exists) => {
        if (exists == null) {
            fs_1.default.appendFile(filePath, data.content.toString(), (err) => {
                if (err)
                    console.error("error in writing to file");
                console.log('Saved!');
            });
        }
        else if (exists.code === 'ENOENT') {
            fs_1.default.writeFile(filePath, data.content.toString(), (err) => {
                if (err)
                    console.error("error in creating file");
                console.log('Created!');
            });
        }
    });
});
//# sourceMappingURL=second-service.js.map