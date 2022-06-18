import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServeMePageRoutingModule } from './serve-me-routing.module';

import { ServeMePage } from './serve-me.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServeMePageRoutingModule
  ],
  declarations: [ServeMePage]
})
export class ServeMePageModule {}
