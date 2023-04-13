import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute,Router } from '@angular/router';
import { AddressDataService } from '../services/address-data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-addres',
  templateUrl: './edit-addres.page.html',
  styleUrls: ['./edit-addres.page.scss'],
})
export class EditAddresPage implements OnInit {
  addrInfoForm: FormGroup;
  Myaddress = new UserAddress();
  lat;lang;
  addr;
  AppConsts = AppConsts;
  id: any;
  userId : string;

constructor(  
  private _session: AppSessionService,
  private _router: Router,
  private _addressService: AddressapiServiceProxy,
  private route: ActivatedRoute,
  public addressDataService: AddressDataService
) { }


  ngOnInit() {
    if (this.route.snapshot.data['address']) {
      this.addrInfoForm = new FormGroup({
        addressTitle: new FormControl(this.Myaddress.addressTitle, [
          Validators.required
        ]),
        area: new FormControl(this.Myaddress.area,[
          Validators.required,
        ]),
        city: new FormControl(this.Myaddress.city,[
          Validators.required,
        ]),
        houseNo: new FormControl(this.Myaddress.houseNo,[
        ]),
        landmark: new FormControl(this.Myaddress.landmark,[
          Validators.required,
        ])
      });
      this.id = this.route.snapshot.data['address'].id;
      this._addressService.getbyid(this.id).subscribe((res)=>{
        this.Myaddress = res;
        this.addr = res.address;
        this.lat = res.latitude;
        this.lang = res.longitude;
        this.addrInfoForm = new FormGroup({
          addressTitle: new FormControl(this.Myaddress.addressTitle, [
            Validators.required
          ]),
          area: new FormControl(this.Myaddress.area,[
            Validators.required,
          ]),
          city: new FormControl(this.Myaddress.city,[
            Validators.required,
          ]),
          houseNo: new FormControl(this.Myaddress.houseNo,[
          ]),
          landmark: new FormControl(this.Myaddress.landmark,[
            Validators.required,
          ])
        });
     
      })
  
 
      this.userId = this.route.snapshot.data['address'].userId;    
    }
  }

  saveAddress()
  { 
    if (this.addrInfoForm.invalid) {
      for (const control of Object.keys(this.addrInfoForm.controls)) {
        this.addrInfoForm.controls[control].markAsTouched();
      }
      return;
    } 
    this.Myaddress = this.addrInfoForm.value;
    this.Myaddress.id = this.id;
    this.Myaddress.userId =this.userId;
    this.Myaddress.address = this.addr;
    this.Myaddress.latitude = this.lat;
    this.Myaddress.longitude = this.lang;

       this._addressService.updateaddress(this.Myaddress).subscribe(
        (res) => {
          this._addressService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.addressDataService.initAddresses(res));
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
  

