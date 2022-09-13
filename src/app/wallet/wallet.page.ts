import { Component, OnInit } from '@angular/core';
import { EwalletServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  total_ammount;

  AppConsts = AppConsts;

  constructor(private _session: AppSessionService,
    private _ewalletService: EwalletServiceProxy) {

  }

  ngOnInit(): void {
    this._ewalletService.totalbyuserid(this._session.userId).subscribe((res: number) => this.total_ammount = res);
  }

}
