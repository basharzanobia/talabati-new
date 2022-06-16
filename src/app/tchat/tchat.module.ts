import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TchatPageRoutingModule } from './tchat-routing.module';

import { TchatPage } from './tchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TchatPageRoutingModule
  ],
  declarations: [TchatPage]
})
export class TchatPageModule {}
