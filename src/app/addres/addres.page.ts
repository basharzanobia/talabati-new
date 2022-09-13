import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addres',
  templateUrl: './addres.page.html',
  styleUrls: ['./addres.page.scss'],
})
export class AddresPage implements OnInit {
  address: string;
  area: string;
  city: string;
  houseNo: string;
  AppConsts = AppConsts;

constructor(  
  private _session: AppSessionService,
  private _router: Router,
  private _addressService: AddressapiServiceProxy,
) { }


  ngOnInit() {
  }
  saveAddress()
  { 
      const address = new UserAddress();
      address.init({
        userId:this._session.userId,
        address: this.address,
        area:this.area,
        city: this.city,
        houseNo: this.houseNo, 
      });
     
      this._addressService.createaddress(address).subscribe(
        (res) => {
            this._router.navigate(['/saved-address']);
          console.log('الرسالة ', 'تم إدخال العنوان');
        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
        });
    }  
  }
  

