import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/shared/service-proxies/service-proxies';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppAuthService } from 'src/shared/auth/app-auth.service';
import { App } from '@capacitor/app';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userInfo: LoginResponseModel;

  constructor(private _session: AppSessionService,
    private _auth: AppAuthService,
    public alertController: AlertController) { }

  ngOnInit() {
    this.userInfo = this._session.user;
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  };
  
  logout() {
    this.withAlert("هل ترغب في الخروج من التطبيق ؟", () =>{
      this._auth.logout();
      App.exitApp();
    });
  }
  async withAlert(message: string, action: () => void) {
    const alert = await this.alertController.create({
      message: message,
      mode:'ios',
      buttons: [
        {
          text: "نعم",
          handler: action
        },
        {
        text: "لا",
        role: "cancel"
      }]
    });

    await alert.present();
  }
}
