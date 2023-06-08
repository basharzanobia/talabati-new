import { Component, OnInit } from '@angular/core';
import { EwalletServiceProxy ,EWallet} from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { AlertController, MenuController } from '@ionic/angular';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  total_amount;
  amount;
  AppConsts = AppConsts;
 
  constructor(private _session: AppSessionService,
    private _ewalletService: EwalletServiceProxy,
    public alertCtrl: AlertController,
    private menuCtrl : MenuController,
    private router : Router
    ) {

  }
  async  showAlert(msg) {  
    const alert = await this.alertCtrl.create({  
      header: 'إضافة رصيد',  
      subHeader: '',  
      message:  msg , 
      buttons: ['تم']  
    });  
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);  
  }  
  goToMenu(){
    this.router.navigate(['/tabs/tab1/1'],{replaceUrl:true});
    this.menuCtrl.toggle();
  }
  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
  deposit(){
    const eWallet = new EWallet();
    eWallet.init({
      userId:this._session.userId,
      amount:this.amount,
      transactionType:1
    });
   
    this._ewalletService.deposite(eWallet).subscribe(
      (res) => {
        this.showAlert('تمت إضافة الرصيد بنجاح!' );  
        this.total_amount+=this.amount;
       this.amount='';
        
      },
      async (error) => {
        // Unexpected result!
        // await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
        this.showAlert('لم تتم إضافة الرصيد بنجاح, حاول مرة أخرى' ); 
        console.log('error ', error);
      });
  }

  ngOnInit(): void {
    this._ewalletService.totalbyuserid(this._session.userId).subscribe((res: number) => this.total_amount = res);
  }

}
