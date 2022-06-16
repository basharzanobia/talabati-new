import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommingsoonPageRoutingModule } from './commingsoon-routing.module';

import { CommingsoonPage } from './commingsoon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommingsoonPageRoutingModule
  ],
  declarations: [CommingsoonPage]
})
export class CommingsoonPageModule {}
