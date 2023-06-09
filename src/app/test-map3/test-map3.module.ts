import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestMap3PageRoutingModule } from './test-map3-routing.module';

import { TestMap3Page } from './test-map3.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestMap3PageRoutingModule,
    
  ],
  declarations: [TestMap3Page]
})
export class TestMap3PageModule {}
