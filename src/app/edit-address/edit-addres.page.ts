import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute,Router } from '@angular/router';
import { AddressDataService } from '../services/address-data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
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
  newlongitude ;
  newlatitude ;
  addressId;
  newAddress;
  addrType;
constructor(  
  private _session: AppSessionService,
  private _router: Router,
  private _addressService: AddressapiServiceProxy,
  private route: ActivatedRoute,
  public addressDataService: AddressDataService,
  private alertController : AlertController
) { }


  ngOnInit() {
    if (this.route.snapshot.data['address']) {
      this.id = this.route.snapshot.data['address'].id;
      this.newlatitude = this.route.snapshot.paramMap.get('lat');
      this.newlongitude = this.route.snapshot.paramMap.get('lang');
      this.newAddress = this.route.snapshot.paramMap.get('addr');
      this.addressId = this.route.snapshot.paramMap.get('id');
      this._addressService.getbyid(this.id).subscribe((res)=>{
        this.Myaddress = res;
        console.log(res.type)
        this.addr = res.address;
        this.lat = res.latitude;
        this.lang = res.longitude;
        this.addrType = res.type;
        console.log(this.lat);
        console.log(this.lang);
        this.addrInfoForm.patchValue({ addressTitle: res.addressTitle });
        this.addrInfoForm.patchValue({ area: res.area });
        this.addrInfoForm.patchValue({ city: res.city });
        this.addrInfoForm.patchValue({ houseNo: res.houseNo });
        this.addrInfoForm.patchValue({ landmark: res.landmark });
        this.addressType.patchValue({ addressType: res.type });
      })
  
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
        ]),
        addressType: new FormControl(this.Myaddress.type,[
          Validators.required,
        ]),
      });
      this.userId = this.route.snapshot.data['address'].userId;    
    }
  }
  get addressTitle() {
    return this.addrInfoForm.get('addressTitle')!;
  }
  get area() {
    return this.addrInfoForm.get('area')!;
  }
  get city() {
    return this.addrInfoForm.get('city')!;
  }
  get houseNo() {
    return this.addrInfoForm.get('houseNo')!;
  }
  get landmark() {
    return this.addrInfoForm.get('landmark')!;
  }
  get addressType() {
    return this.addrInfoForm.get('addressType')!;
  }
  compareWith(o1, o2) {
    console.log(o1);
    console.log(o2);
    return o1 === this.addrType ;
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
    console.log("this.lat "+ this.newlatitude);
    console.log("this.lang "+ this.newlongitude);
    console.log("this.lat "+ this.lat);
    console.log("this.lang "+ this.lang);
    this.Myaddress.address =  this.newAddress === null ? this.addr : this.newAddress;
    this.Myaddress.latitude =  this.newlatitude === null ? this.lat : this.newlatitude;
    this.Myaddress.longitude =  this.newlongitude === null ? this.lang : this.newlongitude; 
    console.log(this.addressType.value);
 /*    this.Myaddress.address =   this.addr ;
    this.Myaddress.latitude = this.lat ;
    this.Myaddress.longitude =  this.lang; */
    console.log("this.Myaddress.latitude "+  this.Myaddress.latitude);
    console.log("   this.Myaddress.longitude "+    this.Myaddress.longitude);
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
  

