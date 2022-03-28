import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderCanceledPage } from './order-canceled.page';

const routes: Routes = [
  {
    path: '',
    component: OrderCanceledPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderCanceledPageRoutingModule {}
