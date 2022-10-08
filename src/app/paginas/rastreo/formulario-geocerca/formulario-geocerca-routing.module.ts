import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioGeocercaPage } from './formulario-geocerca.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioGeocercaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioGeocercaPageRoutingModule {}
