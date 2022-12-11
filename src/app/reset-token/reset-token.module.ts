import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetTokenPageRoutingModule } from './reset-token-routing.module';

import { ResetTokenPage } from './reset-token.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    ResetTokenPageRoutingModule
  ],
  declarations: [ResetTokenPage]
})
export class ResetTokenPageModule {}
