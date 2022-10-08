import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioGeocercaPageRoutingModule } from './formulario-geocerca-routing.module';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

import { FormularioGeocercaPage } from './formulario-geocerca.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentesModule,
    FormularioGeocercaPageRoutingModule
  ],
  declarations: [FormularioGeocercaPage]
})
export class FormularioGeocercaPageModule {}
