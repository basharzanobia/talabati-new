import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { BuyMe, BuyrequestServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-buy-for-me',
  templateUrl: './buy-for-me.page.html',
  styleUrls: ['./buy-for-me.page.scss'],
})
export class BuyForMePage implements OnInit {

  reqModel: BuyMe = new BuyMe();

  constructor(
    private _service: BuyrequestServiceProxy,
    private _router: Router,
    public alertController: AlertController) { }

  ngOnInit() {

  }

  save() {
    this.reqModel.recieverDate = moment(this.reqModel.recieverDate);
    this.reqModel.senderDate = moment(this.reqModel.senderDate);

    this._service.addrequest(this.reqModel).subscribe(
    (res) => {
        this._router.navigate(['/tabs/tab2']);
    },
    async (error) => {
      // Unexpected result!
      await this.presentAlert('فشل', 'حدث خطأ حاول مرة أخرى', null);
      console.log('error ', error);
    });
  }

  async presentAlert(header: string, msg: string, subHeader: string) {
    const alert = await this.alertController.create({
      cssClass: 'app-alert',
      header: header,
      subHeader: subHeader,
      message: msg,
      buttons: ['حسنا']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

}
