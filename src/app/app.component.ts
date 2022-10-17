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
  
  constructor(
     private platform: Platform,
   // private splashScreen: SplashScreen,
   // private statusBar: StatusBar,
      private _location: Location,
      public alertController: AlertController,
      private router: Router,
      private navController: NavController,
      private toastController: ToastController,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.init();
  }

 
  async init() {
      this.platform.backButton.subscribeWithPriority(12, async () => {
        const currentUrl = this.router.url;
        if (currentUrl === "/intro" || currentUrl === "/splash") {
          // this.withDoublePress("Press again to exit", () => {
          this.withAlert("هل أنت متأكد من الخروج", () =>{
           navigator['app'].exitApp();
          
          });
        } else {
          this.navController.back();
        }
  
      });
    }

    
  
    // async withDoublePress(message: string, action: () => void) {
    //   const currentTime = new Date().getTime();
  
    //   if (currentTime - this.lastTimeBackButtonWasPressed < this.timePeriodToAction) {
    //     action();
    //   } else {
    //     const toast = await this.toastController.create({
    //       message: message,
    //       duration: this.timePeriodToAction
    //     });
  
    //     await toast.present();
  
    //     this.lastTimeBackButtonWasPressed = currentTime;
    //   }
    // }
  
    async withAlert(message: string, action: () => void) {
      const alert = await this.alertController.create({
        message: message,
        buttons: [{
          text: "إلغاء",
          role: "cancel"
        },
        {
          text: "متأكد",
          handler: action
        }]
      });
  
      await alert.present();
    }
  
    

}
