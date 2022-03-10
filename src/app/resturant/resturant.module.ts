import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResturantPageRoutingModule } from './resturant-routing.module';

import { ResturantPage } from './resturant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResturantPageRoutingModule
  ],
  declarations: [ResturantPage]
})
export class ResturantPageModule {}
