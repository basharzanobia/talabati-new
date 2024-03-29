import { Component } from '@angular/core';
import { Optional } from '@angular/core';
import { IonRouterOutlet, Platform, AlertController } from '@ionic/angular';

// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  NavController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { AppSessionService } from 'src/shared/session/app-session.service';
import { AppConsts } from 'src/shared/AppConsts';
import { RouteInterceptorServiceService } from './services/route-interceptor-service.service';
import { AppAuthService } from 'src/shared/auth/app-auth.service';




@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private lastTimeBackButtonWasPressed = 1000;
   private timePeriodToAction =0;
   userId;
   adminId; 

  constructor(
       private platform: Platform,
      // private splashScreen: SplashScreen,
      // private statusBar: StatusBar,
      private _location: Location,
      public alertController: AlertController,
      private router: Router,
      private navController: NavController,
      private toastController: ToastController,
      private _session: AppSessionService,
      private _auth : AppAuthService,
      private routeService : RouteInterceptorServiceService,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    
    this.initializeApp();
  }
  
  initializeApp() {
  
    App.addListener('backButton', () => {
      const currentUrl = this.router.url;
      if (currentUrl === "/intro") {
        // this.withDoublePress("Press again to exit", () => {
      /*     const logo = document.getElementById('logo');
          logo.style.display = 'none'; */
          this.withAlert("هل ترغب في الخروج من التطبيق ؟", () =>{
          App.exitApp();
    });
  }
 
}
  ); 
}
  
exit(){
  this.withAlert("هل ترغب في الخروج من التطبيق ؟", () =>{
    this._auth.logout();
    App.exitApp();
  });
}

openChat(){
  this.adminId = AppConsts.adminId; 
  this.userId=this._session.userId; 
  this.router.navigate(['/tchat',this.userId,this.adminId]);
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
