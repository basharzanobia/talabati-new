import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponentComponent } from '../components/popover-component/popover-component.component';
import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-test-map',
  templateUrl: './test-map.page.html',
  styleUrls: ['./test-map.page.scss'],
})
export class TestMapPage implements OnInit {
  loc = 'Locating...';
  constructor(
    public popoverController: PopoverController,
    private locationAccuracy: LocationAccuracy
  ) { }

  ngOnInit() {
  }
  async enableLocation() {
    try {
      const status = await this.requestLocationPermissionService();
      console.log(status);
      if(status?.location == 'granted') {
        const stat = await this.enableLocationService();
        if(stat) {
          const coordinates = await this.getCurrentLocationService();
          console.log(coordinates);
        }
      }
    } catch(e) {
      console.log(e);
    }
  }
  async getCurrentLocation() {
    try {
      const coordinates = await this.getCurrentLocationService();
      console.log('Current position:', coordinates);
    } catch(e) {
      console.log(e);
      this.openPopover();
    }
  }

  openPopover() {
    const ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            left: 5
          };
        }
      }
    };
    this.presentPopover(ev);
  }
  
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponentComponent,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with data', data);
    if(data) {
      this.enableLocation();
    } else {
      this.loc = 'Karol Bagh, Delhi';
    }
  } 
  async requestGeolocationPermission() {
    try {
      const status = await this.requestLocationPermissionService();
      console.log(status);
      if(status?.location == 'granted') this.getCurrentLocation();
      else this.loc = 'Karol Bagh, Delhi';
    } catch(e) {
      console.log(e);
    }
  }






  async enableLocationService() {
    try {
      const canRequest: boolean = await this.locationAccuracy.canRequest();
      console.log('canrequest: ', canRequest);
      if(canRequest) {
        await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        console.log('Request successful');
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  getCurrentLocationService() {
    return Geolocation.getCurrentPosition()
    .then(coordinates => {
      return coordinates;
    })
    .catch(e => {
      throw(e);
    });
  }

  requestLocationPermissionService() {
    return Geolocation.requestPermissions()
    .then(status => {
      return status;
    })
    .catch(e => {
      throw(e);
    });
  }

}
