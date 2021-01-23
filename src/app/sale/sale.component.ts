import { Component, OnInit } from '@angular/core';
import { EthereumService } from '../ethereum.service';

import ContractPrivateSale from '../../config/PrivateSale.js';
import ContractToken from '../../config/Token.js';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  isMetaMaskInstalled = true;
  account: string = null;
  sale = '0x000000000000000000';
  token = '0x000000000000000000';

  constructor(
    private readonly eth: EthereumService,
  ) { }

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

    const tokenInstance = new (this.eth.getWeb3()).eth.Contract(
      ContractToken.abi,
      this.token
    );

    const saleInstance = new (this.eth.getWeb3()).eth.Contract(
      ContractPrivateSale.abi,
      this.sale
    );
  }

}
