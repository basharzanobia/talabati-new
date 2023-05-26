import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantNewPage } from './restaurant-new.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantNewPageRoutingModule {}
