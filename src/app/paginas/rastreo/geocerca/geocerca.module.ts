import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeocercaPageRoutingModule } from './geocerca-routing.module';

import { GeocercaPage } from './geocerca.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeocercaPageRoutingModule,
    ComponentesModule
  ],
  declarations: [GeocercaPage]
})
export class GeocercaPageModule {}
