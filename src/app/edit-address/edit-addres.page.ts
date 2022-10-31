import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-addres',
  templateUrl: './edit-addres.page.html',
  styleUrls: ['./edit-addres.page.scss'],
})
export class EditAddresPage implements OnInit {
  address: string;
  area: string;
  city: string;
  houseNo: string;
  AppConsts = AppConsts;
  data: any;

constructor(  
  private _session: AppSessionService,
  private _router: Router,
  private _addressService: AddressapiServiceProxy,
  private route: ActivatedRoute,
) { }


  ngOnInit() {
    if (this.route.snapshot.data['address']) {
      this.address = this.route.snapshot.data['address'].address;
      this.area = this.route.snapshot.data['address'].area;
      this.city = this.route.snapshot.data['address'].city;
      this.houseNo = this.route.snapshot.data['address'].houseNo;    
    }
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
          console.log('الرسالة ', 'تم تعديل العنوان');
        },
        async (error) => {
          // Unexpected result!
          // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
          console.log('error ', error);
        });
    }  
  }
  

