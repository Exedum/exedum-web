

import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare global {
    interface Window { ethereum: any; }
}

@Injectable()
export class EthereumService {

    private web3;

    public init(): void {
        if (window.ethereum) {
            this.web3 = new Web3(window.ethereum);
        }
    }

    public isMetamaskInstalled(): boolean {
        if (window.ethereum) {
            return true;
        }
        return false;
    }

    public getWeb3(): any {
        if (!this.web3) {
            throw new Error('Call init() first and make sure metamask is installed');
        }
    }

    public async loginWithMetamask(): Promise<string> {
        return new Promise((resolve, reject) => {
            window.ethereum.enable().then((account) => {
                if (account !== null) {
                    resolve(account[0]);
                }
                reject('No accounts found');
            });
        });
    }
}
