var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import BIPPath from "bip32-path";
import { UserRefusedOnDevice, UserRefusedAddress, TransportError, } from "@ledgerhq/errors";
var CHUNK_SIZE = 250;
var CLA = 0x90;
var INS = {
    GET_VERSION: 0x00,
    GET_ADDR_ED25519: 0x01,
    SIGN_ED25519: 0x02
};
var PAYLOAD_TYPE_INIT = 0x00;
var PAYLOAD_TYPE_ADD = 0x01;
var PAYLOAD_TYPE_LAST = 0x02;
var SW_OK = 0x9000;
var SW_CANCEL = 0x6986;
var SW_ERROR_DATA_INVALID = 0x6984;
var SW_ERROR_BAD_KEY_HANDLE = 0x6a80;
/**
 * Polkadot API
 *
 * @example
 * import Polkadot from "@ledgerhq/hw-app-polkadot";
 * const polkadot = new Polkadot(transport)
 */
var Polkadot = /** @class */ (function () {
    function Polkadot(transport) {
        this.transport = transport;
        transport.decorateAppAPIMethods(this, ["getAddress", "sign"], "DOT");
    }
    Polkadot.prototype.serializePath = function (path) {
        var buf = Buffer.alloc(20);
        buf.writeUInt32LE(path[0], 0);
        buf.writeUInt32LE(path[1], 4);
        buf.writeUInt32LE(path[2], 8);
        buf.writeUInt32LE(path[3], 12);
        buf.writeUInt32LE(path[4], 16);
        return buf;
    };
    /**
     * @param {string} path
     * @param {boolean} requireConfirmation - if true, user must valid if the address is correct on the device
     */
    Polkadot.prototype.getAddress = function (path, requireConfirmation) {
        if (requireConfirmation === void 0) { requireConfirmation = false; }
        return __awaiter(this, void 0, void 0, function () {
            var bipPath, bip44Path;
            return __generator(this, function (_a) {
                bipPath = BIPPath.fromString(path).toPathArray();
                bip44Path = this.serializePath(bipPath);
                return [2 /*return*/, this.transport
                        .send(CLA, INS.GET_ADDR_ED25519, requireConfirmation ? 1 : 0, 0, bip44Path, [SW_OK, SW_CANCEL])
                        .then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        if (returnCode === SW_CANCEL) {
                            throw new UserRefusedAddress();
                        }
                        return {
                            pubKey: response.slice(0, 32).toString("hex"),
                            address: response.slice(32, response.length - 2).toString("ascii"),
                            return_code: returnCode
                        };
                    })];
            });
        });
    };
    Polkadot.prototype.foreach = function (arr, callback) {
        function iterate(index, array, result) {
            if (index >= array.length) {
                return result;
            }
            else
                return callback(array[index], index).then(function (res) {
                    result.push(res);
                    return iterate(index + 1, array, result);
                });
        }
        return Promise.resolve().then(function () { return iterate(0, arr, []); });
    };
    /**
     * Sign a payload
     * @param {*} path
     * @param {string} message - payload
     * @returns {string} - signed payload to be broadcasted
     */
    Polkadot.prototype.sign = function (path, message) {
        return __awaiter(this, void 0, void 0, function () {
            var bipPath, serializedPath, chunks, buffer, i, end, response;
            var _this = this;
            return __generator(this, function (_a) {
                bipPath = BIPPath.fromString(path).toPathArray();
                serializedPath = this.serializePath(bipPath);
                chunks = [];
                chunks.push(serializedPath);
                buffer = Buffer.from(message);
                for (i = 0; i < buffer.length; i += CHUNK_SIZE) {
                    end = i + CHUNK_SIZE;
                    if (i > buffer.length) {
                        end = buffer.length;
                    }
                    chunks.push(buffer.slice(i, end));
                }
                response = {};
                return [2 /*return*/, this.foreach(chunks, function (data, j) {
                        return _this.transport
                            .send(CLA, INS.SIGN_ED25519, j === 0
                            ? PAYLOAD_TYPE_INIT
                            : j + 1 === chunks.length
                                ? PAYLOAD_TYPE_LAST
                                : PAYLOAD_TYPE_ADD, 0, data, [SW_OK, SW_CANCEL, SW_ERROR_DATA_INVALID, SW_ERROR_BAD_KEY_HANDLE])
                            .then(function (apduResponse) { return (response = apduResponse); });
                    }).then(function () {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        if (returnCode === SW_CANCEL) {
                            throw new UserRefusedOnDevice();
                        }
                        if (returnCode === SW_ERROR_DATA_INVALID ||
                            returnCode === SW_ERROR_BAD_KEY_HANDLE) {
                            var errorMessage = response
                                .slice(0, response.length - 2)
                                .toString("ascii");
                            throw new TransportError(errorMessage, "Sign");
                        }
                        var signature = null;
                        if (response.length > 2) {
                            signature = response.slice(0, response.length - 2);
                        }
                        return {
                            signature: signature,
                            return_code: returnCode
                        };
                    })];
            });
        });
    };
    return Polkadot;
}());
export default Polkadot;
//# sourceMappingURL=Polkadot.js.map