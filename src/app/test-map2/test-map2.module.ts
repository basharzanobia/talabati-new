import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestMap2PageRoutingModule } from './test-map2-routing.module';

import { TestMap2Page } from './test-map2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestMap2PageRoutingModule
  ],
  declarations: [TestMap2Page]
})
export class TestMap2PageModule {}
