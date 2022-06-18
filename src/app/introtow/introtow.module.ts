import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntrotowPageRoutingModule } from './introtow-routing.module';

import { IntrotowPage } from './introtow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntrotowPageRoutingModule
  ],
  declarations: [IntrotowPage]
})
export class IntrotowPageModule {}
