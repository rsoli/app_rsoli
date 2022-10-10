import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioGeocercaPageRoutingModule } from './formulario-geocerca-routing.module';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

import { FormularioGeocercaPage } from './formulario-geocerca.page';

import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { GeocercaPage } from '../../rastreo/geocerca/geocerca.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentesModule,
    FormularioGeocercaPageRoutingModule,
    ReactiveFormsModule,
    LeafletModule,
    LeafletDrawModule
  ],
  declarations: [FormularioGeocercaPage],
  providers:[GeocercaPage]
})
export class FormularioGeocercaPageModule {}
