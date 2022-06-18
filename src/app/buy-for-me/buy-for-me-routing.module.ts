import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyForMePage } from './buy-for-me.page';

const routes: Routes = [
  {
    path: '',
    component: BuyForMePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyForMePageRoutingModule {}
