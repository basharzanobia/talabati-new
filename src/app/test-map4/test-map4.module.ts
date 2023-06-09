import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestMap4PageRoutingModule } from './test-map4-routing.module';

import { TestMap4Page } from './test-map4.page';
import { GoogleMapsModule } from '@angular/google-maps';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestMap4PageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [TestMap4Page]
})
export class TestMap4PageModule {}
