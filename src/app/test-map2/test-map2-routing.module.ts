import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestMap2Page } from './test-map2.page';

const routes: Routes = [
  {
    path: '',
    component: TestMap2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestMap2PageRoutingModule {}
