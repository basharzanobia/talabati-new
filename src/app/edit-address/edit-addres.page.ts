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
  id: any;
  userId : string;

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
      this.id = this.route.snapshot.data['address'].id;
      this.userId = this.route.snapshot.data['address'].userId;    
    }
  }
  saveAddress()
  { 
      const address = new UserAddress();
      address.init({
        id:this.id,
        userId:this.userId,
        address: this.address,
        area:this.area,
        city: this.city,
        houseNo: this.houseNo, 
      });
     
      this._addressService.updateaddress(address).subscribe(
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
  

