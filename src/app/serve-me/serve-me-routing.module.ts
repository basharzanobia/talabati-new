import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServeMePage } from './serve-me.page';

const routes: Routes = [
  {
    path: '',
    component: ServeMePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServeMePageRoutingModule {}
