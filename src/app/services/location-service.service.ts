import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';  
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Capacitor } from "@capacitor/core";
@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {
  constructor(private locationAccuracy: LocationAccuracy) { } 
    async checkGPSPermission (): Promise<boolean>  {
    return await new Promise((resolve, reject) => {
        if (Capacitor.isNative) {
            AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
                result => {
                    if (result.hasPermission) {
                        // If having permission show 'Turn On GPS' dialogue
                        resolve(true);
                    } else {
                        // If not having permission ask for permission
                        resolve(false);
                    }
                },
                err => { alert(err); }
            );
        }
        else { resolve(true);  }
    })
}


async requestGPSPermission (): Promise<string>  {
  return await new Promise((resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
              resolve('CAN_REQUEST');
          } else {
              // Show 'GPS Permission Request' dialogue
              AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                  .then(
                      (result) => {
                          if (result.hasPermission) {
                              // call method to turn on GPS
                              resolve('GOT_PERMISSION');
                          } else {
                              resolve('DENIED_PERMISSION');
                          }
                      },
                      error => {
                          // Show alert if user click on 'No Thanks'
                          alert('requestPermission Error requesting location permissions ' + error);
                      }
                  );
          }
      });
  })
}


async askToTurnOnGPS(): Promise<boolean>  {
  return await new Promise((resolve, reject) => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
              // the accuracy option will be ignored by iOS
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                  () => {
                      resolve(true);
                  },
                  error => { resolve(false); } );
          }
          else { resolve(false);  }
      });
  })
}

}
