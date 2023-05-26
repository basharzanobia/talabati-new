import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantNewPageRoutingModule } from './restaurant-new-routing.module';

import { RestaurantNewPage } from './restaurant-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantNewPageRoutingModule
  ],
  declarations: [RestaurantNewPage]
})
export class RestaurantNewPageModule {}
