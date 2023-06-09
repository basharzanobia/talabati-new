import { Component, OnInit } from '@angular/core';
import { LocationServiceService } from '../services/location-service.service';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-test-map3',
  templateUrl: './test-map3.page.html',
  styleUrls: ['./test-map3.page.scss'],
})
export class TestMap3Page implements OnInit {

  constructor(private locationService : LocationServiceService,
   private  alertController : AlertController) { }

  async ngOnInit() {
   await  this.checkPermissions();
  }

   async checkPermissions ()  {
    const hasPermission = await this.locationService.checkGPSPermission();
    if (hasPermission) {
        if (Capacitor.isNative) {
            const canUseGPS = await this.locationService.askToTurnOnGPS();
            this.postGPSPermission(canUseGPS);
        }
        else {
            this.postGPSPermission(true);
        }
    }
    else {
        console.log('14');
        const permission = await this.locationService.requestGPSPermission();
        if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
            if (Capacitor.isNative) {
                const canUseGPS = await this.locationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else {
                this.postGPSPermission(true);
            }
        }
        else {
            this.withAlert('User denied location permission', () =>{
            });
        }
    }
}

async postGPSPermission  (canUseGPS: boolean)  {
    if (canUseGPS) {
        this.withAlert("success", () =>{
        });
    }
    else {

        this.withAlert("Please turn on GPS to get location ؟", () =>{
        });
      }
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
