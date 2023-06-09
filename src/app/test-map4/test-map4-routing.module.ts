import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestMap4Page } from './test-map4.page';

const routes: Routes = [
  {
    path: '',
    component: TestMap4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestMap4PageRoutingModule {}
