import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-saved-address',
  templateUrl: './saved-address.page.html',
  styleUrls: ['./saved-address.page.scss'],
})
export class SavedAddressPage implements OnInit {

  customFormatter;
  userAddress:UserAddress[]=[];
  AppConsts = AppConsts;

  constructor(private _session: AppSessionService,
    private route: ActivatedRoute,
    private _addressService: AddressapiServiceProxy) {

  }

  ngOnInit(): void {
    this._addressService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.userAddress = res);
  }

}
