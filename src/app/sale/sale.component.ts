import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import ContractPrivateSale from '../../config/PrivateSale.js';
import ContractToken from '../../config/Token.js';
import { EthereumService } from '../ethereum.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  bcrypt = require('bcryptjs');
  hashPrivateSale =
    '$2a$10$.etXUqDm1FTgzg9YTFje5.n2wS90rV18GMe4nOTx7L/0m/.tB6zE2';

  isMetaMaskInstalled = true;
  account: string = null;
  canClaim: boolean = false;
  saleAccessGranted: boolean = false;

  sale = '0x4d7c10c770e25789b5e861ad7e2897ab8a24a9fb';
  token = '0xeb00131f8Ba63922d63C9F22Ff49acaC6BC56456';

  ethBalance = '0';
  exedBalance = '0';
  unclaimedExedum = '0';

  ethInputValue = 0;
  exedInputValue = 0;

  constructor(
    private readonly eth: EthereumService,
    private readonly cd: ChangeDetectorRef
  ) {}

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

  checkSalePassword(password: string) {
    this.bcrypt.compare(password, this.hashPrivateSale, (err, result) => {
      this.saleAccessGranted = result;
      this.cd.detectChanges();
    });
  }
}
