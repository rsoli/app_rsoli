import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsuarioPageRoutingModule } from './usuario-routing.module';
import { UsuarioPage } from './usuario.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UsuarioPageRoutingModule,
    ComponentesModule
  ],
  declarations: [UsuarioPage]
})
export class UsuarioPageModule {}
