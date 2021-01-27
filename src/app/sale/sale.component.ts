import { Component, OnInit } from '@angular/core';
import ContractPrivateSale from '../../config/PrivateSale.js';
import ContractSale from '../../config/Sale.js';
import ContractToken from '../../config/Token.js';
import { EthereumService } from '../ethereum.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  isMetaMaskInstalled = true;
  account: string = null;
  canClaim: boolean = false;
  canPrivateClaim: boolean = false;

  sale = '0x6f5bf7470af262089e7f8aeab3fe60fe89d49635';
  privateSale = '0x1125835085168B56dF42aEB33DE501d3De86e05D';
  token = '0x9baf5147505b980b2674aab556a51e03b3082efe';

  ethBalance = '0';
  exedBalance = '0';
  unclaimedSale = '0';
  unclaimedPrivateSale = '0';

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
      ContractSale.abi,
      this.sale
    );

    const privateSaleInstance = new (this.eth.getWeb3().eth.Contract)(
      ContractPrivateSale.abi,
      this.privateSale
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
              this.unclaimedSale = this.eth
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
          privateSaleInstance.methods
            .getClaimableTokens(accounts[0])
            .call()
            .then((data) => {
              this.unclaimedPrivateSale = this.eth
                .getWeb3()
                .utils.fromWei(data, 'ether');
            });
        }
      });

    privateSaleInstance.methods
      .canClaim()
      .call()
      .then((data) => {
        this.canPrivateClaim = data;
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
                    parseInt(this.unclaimedSale) +
                    parseInt(this.unclaimedPrivateSale)
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

  claimSaleAll() {
    const saleInstance = new (this.eth.getWeb3().eth.Contract)(
      ContractSale.abi,
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
              this.unclaimedSale = '0';
            });
        }
      });
  }

  claimPrivateSaleAll() {
    const privateSaleInstance = new (this.eth.getWeb3().eth.Contract)(
      ContractPrivateSale.abi,
      this.privateSale
    );

    this.eth
      .getWeb3()
      .eth.getAccounts()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          privateSaleInstance.methods
            .claim()
            .send({ from: accounts[0] })
            .then((data) => {
              this.unclaimedPrivateSale = '0';
            });
        }
      });
  }

  onEthInputChange(ethAmount: number): void {
    this.ethInputValue = ethAmount;
    this.exedInputValue = ethAmount * 2000;
  }

  onExedInputChange(exedAmount: number): void {
    this.exedInputValue = exedAmount;
    this.ethInputValue = exedAmount / 2000;
  }
}
