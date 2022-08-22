/// <reference types="node" />
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2017-2018 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
import type Transport from "@ledgerhq/hw-transport";
/**
 * Polkadot API
 *
 * @example
 * import Polkadot from "@ledgerhq/hw-app-polkadot";
 * const polkadot = new Polkadot(transport)
 */
export default class Polkadot {
    transport: Transport;
    constructor(transport: Transport);
    serializePath(path: Array<number>): Buffer;
    /**
     * @param {string} path
     * @param {boolean} requireConfirmation - if true, user must valid if the address is correct on the device
     */
    getAddress(path: string, requireConfirmation?: boolean): Promise<{
        pubKey: string;
        address: string;
        return_code: number;
    }>;
    foreach<T, A>(arr: T[], callback: (arg0: T, arg1: number) => Promise<A>): Promise<A[]>;
    /**
     * Sign a payload
     * @param {*} path
     * @param {string} message - payload
     * @returns {string} - signed payload to be broadcasted
     */
    sign(path: string, message: string): Promise<{
        signature: null | string;
        return_code: number;
    }>;
}
//# sourceMappingURL=Polkadot.d.ts.map