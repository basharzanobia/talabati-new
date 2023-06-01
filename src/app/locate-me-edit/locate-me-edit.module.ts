import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocateMeEditPageRoutingModule } from './locate-me-edit-routing.module';

import { LocateMeEditPage } from './locate-me-edit.page';
import { GoogleMapsModule } from '@angular/google-maps';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocateMeEditPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [LocateMeEditPage]
})
export class LocateMeEditPageModule {}
