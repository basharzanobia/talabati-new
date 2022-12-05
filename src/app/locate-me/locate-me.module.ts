import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocateMePageRoutingModule } from './locate-me-routing.module';

import { LocateMePage } from './locate-me.page';
import { GoogleMapsModule } from '@angular/google-maps';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocateMePageRoutingModule,
    GoogleMapsModule,
  ],
  declarations: [LocateMePage]
})
export class LocateMePageModule {}
