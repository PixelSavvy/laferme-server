"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, status, message, data) => {
    // If there is data, send to the client
    if (data !== undefined) {
        return res.status(status).json({
            message,
            data,
        });
    }
    // If there is no data, omit from the client
    return res.status(status).json({ message });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map