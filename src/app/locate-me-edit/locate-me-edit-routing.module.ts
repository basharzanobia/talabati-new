import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocateMeEditPage } from './locate-me-edit.page';

const routes: Routes = [
  {
    path: '',
    component: LocateMeEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocateMeEditPageRoutingModule {}
