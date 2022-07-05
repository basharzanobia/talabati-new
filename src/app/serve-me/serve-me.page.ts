import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { ServeMe, ServerequestServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-serve-me',
  templateUrl: './serve-me.page.html',
  styleUrls: ['./serve-me.page.scss'],
})
export class ServeMePage implements OnInit {
  reqModel: ServeMe = new ServeMe();

  constructor(
    private _service: ServerequestServiceProxy,
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
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

}
