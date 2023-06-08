import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestMapPageRoutingModule } from './test-map-routing.module';

import { TestMapPage } from './test-map.page';
import { PopoverComponentComponent } from '../components/popover-component/popover-component.component';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,  
    IonicModule,
    TestMapPageRoutingModule
  ],
  exports: [
    PopoverComponentComponent
],
  declarations: [TestMapPage,PopoverComponentComponent]
})
export class TestMapPageModule {}
