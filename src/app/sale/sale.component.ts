import { Component, OnInit } from '@angular/core';
import { EthereumService } from '../ethereum.service';

import ContractPrivateSale from '../../config/PrivateSale.js';
import ContractToken from '../../config/Token.js';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  isMetaMaskInstalled = true;
  account: string = null;
  canClaim: boolean = false;

  sale = '0x6834DDC9Bfc25e394e5b7fDC55dF9d798B4d295e';
  token = '0xfFfF12Fd506F15230364032d0993AaCa46e0c41c';

  ethBalance = '0';
  exedBalance = '0';
  unclaimedExedum = '0';

  ethInputValue = 0;
  exedInputValue = 0;

  constructor(private readonly eth: EthereumService) {}

  ngOnInit(): void {
    this.initEth();
  }

  async login(): Promise<void> {
    this.account = await this.eth.loginWithMetamask();
  }

  private async initEth(): Promise<void> {
    this.isMetaMaskInstalled = this.eth.isMetamaskInstalled();
    this.eth.init();
    this.login();

    const tokenInstance = new (this.eth.getWeb3().eth.Contract)(
      ContractToken.abi,
      this.token
    );

    const saleInstance = new (this.eth.getWeb3().eth.Contract)(
      ContractPrivateSale.abi,
      this.sale
    );

    this.eth
      .getWeb3()
      .eth.getAccounts()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          saleInstance.methods
            .getClaimableTokens(accounts[0])
            .call()
            .then((data) => {
              this.unclaimedExedum = this.eth
                .getWeb3()
                .utils.fromWei(data, 'ether');
            });
        }
      });

    saleInstance.methods
      .canClaim()
      .call()
      .then((data) => {
        this.canClaim = data;
      });

    this.eth
      .getWeb3()
      .eth.getAccounts()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          this.eth
            .getWeb3()
            .eth.getBalance(accounts[0])
            .then((data) => {
              this.ethBalance = this.eth.getWeb3().utils.fromWei(data, 'ether');

              tokenInstance.methods
                .balanceOf(accounts[0])
                .call()
                .then((data) => {
                  this.exedBalance = (
                    parseInt(this.eth.getWeb3().utils.fromWei(data, 'ether')) +
                    parseInt(this.unclaimedExedum)
                  ).toString();
                });
            });
        }
      });
  }

  buy(): void {
    this.eth
      .getWeb3()
      .eth.getAccounts()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          this.eth.getWeb3().eth.sendTransaction({
            from: accounts[0],
            to: this.sale,
            value: this.eth
              .getWeb3()
              .utils.toWei(this.ethInputValue.toString(), 'ether'),
          });
        }
      });
  }

  claimAll() {
    const saleInstance = new (this.eth.getWeb3().eth.Contract)(
      ContractPrivateSale.abi,
      this.sale
    );

    this.eth
      .getWeb3()
      .eth.getAccounts()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          saleInstance.methods
            .claim()
            .send({ from: accounts[0] })
            .then((data) => {
              this.unclaimedExedum = '0';
            });
        }
      });
  }

  onEthInputChange(ethAmount: number): void {
    this.ethInputValue = ethAmount;
    this.exedInputValue = ethAmount * 3000;
  }

  onExedInputChange(exedAmount: number): void {
    this.exedInputValue = exedAmount;
    this.ethInputValue = exedAmount / 3000;
  }
}
