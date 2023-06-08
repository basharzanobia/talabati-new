import { Component, OnInit } from '@angular/core';
import { UserAddress, AddressapiServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { ActivatedRoute ,Router} from '@angular/router';
import { AddressDataService } from '../services/address-data.service';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-saved-address',
  templateUrl: './saved-address.page.html',
  styleUrls: ['./saved-address.page.scss'],
})
export class SavedAddressPage implements OnInit {

  customFormatter;
  userAddresses:UserAddress[]=[];
  AppConsts = AppConsts;

  constructor(private _session: AppSessionService,
    private route: ActivatedRoute,
    private _router: Router,
    private _addressService: AddressapiServiceProxy,
    public addressDataService: AddressDataService,
     private alertController: AlertController,
     public menuCtrl: MenuController) {

  }
  locateMe(){
    this._router.navigate(['/locate-me']);
  }
  goToMenu(){
    this._router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    this.menuCtrl.toggle();
  }
  ngOnInit(): void {
    this._addressService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.addressDataService.initAddresses(res));
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
  deleteAddress(id)
  {  
      this._addressService.deleteaddress(id).subscribe(
        (res) => {
          this._addressService.getrequestsbyuserid(this._session.userId).subscribe((res: UserAddress[]) => this.addressDataService.initAddresses(res));
          this._router.navigate(['/saved-address']);
          console.log('الرسالة ', 'تم حذف العنوان');
        },
        async (error) => {
          console.log('error ', error);
          this.withAlert("عذرا لم يتم حذف العنوان،لأنه مرتبط بطلبات سابقة، حاول تعديله", () =>{
          })
        });
    }  
    async withAlert(message: string, action: () => void) {
      const alert = await this.alertController.create({
        message: message,
        mode:'ios',
        buttons: [
          {
            text: "موافق",
            handler: action
          }]
      });
  
      await alert.present();
    }
 
    async alertDeleteAddress(id) {
      const alert = await this.alertController.create({
        header: 'تأكيد ',
        subHeader : 'هل تريد بالتأكيد حذف هذا العنوان؟',
        buttons: [
          {
            text: 'موافق',
                handler: () => { //takes the data 
           
                this.deleteAddress(id);
                
                }   
        },
        {
          text: 'الغاء',
          role: 'cancel',
          handler: () => {
           
          },
        }, 
        ],
    
      });
    
      await alert.present();
    }
}
