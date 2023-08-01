import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RastreoPageRoutingModule } from './rastreo-routing.module';

import { RastreoPage } from './rastreo.page';

import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RastreoPageRoutingModule,
    ComponentesModule
  ],
  declarations: [RastreoPage]
})
export class RastreoPageModule {}
