import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResturantPage } from './resturant.page';

const routes: Routes = [
  {
    path: '',
    component: ResturantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResturantPageRoutingModule {}
