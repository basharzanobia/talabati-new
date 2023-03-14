import { Injectable } from '@angular/core';
//import { LocationAccuracy } from '@ionic-native/location-accuracy';
@Injectable({
  providedIn: 'root'
})
export class BackgroundGeolocationService {

  constructor() { }
  async askToTurnOnGPS(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        /*
        LocationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                // the accuracy option will be ignored by iOS
                LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => {
                        resolve(true);
                    },
                    error => {
                        resolve(false);
                    }
                );
            }
            else {resolve(false);}
        });
        */
    })
}

}
