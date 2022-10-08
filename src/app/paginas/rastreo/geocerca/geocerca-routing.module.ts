import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeocercaPage } from './geocerca.page';

const routes: Routes = [
  {
    path: '',
    component: GeocercaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeocercaPageRoutingModule {}
