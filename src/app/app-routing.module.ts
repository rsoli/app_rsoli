import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./paginas/seguridad/iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./paginas/seguridad/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./paginas/principal/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'monitoreo',
    loadChildren: () => import('./paginas/rastreo/monitoreo/monitoreo.module').then( m => m.MonitoreoPageModule)
  },
  {
    path: 'pago',
    loadChildren: () => import('./paginas/rastreo/pago/pago.module').then( m => m.PagoPageModule)
  },
  {
    path: 'geocerca',
    loadChildren: () => import('./paginas/rastreo/geocerca/geocerca.module').then( m => m.GeocercaPageModule)
  },
  {
    path: 'formulario-geocerca/:id/:nombre_geocerca/:descripcion/:area/:tipo_geocerca',
    loadChildren: () => import('./paginas/rastreo/formulario-geocerca/formulario-geocerca.module').then( m => m.FormularioGeocercaPageModule)
  },
  {
    path: 'vehiculo',
    loadChildren: () => import('./paginas/rastreo/vehiculo/vehiculo.module').then( m => m.VehiculoPageModule)
  },
  {
    path: 'mantenimiento',
    loadChildren: () => import('./paginas/rastreo/mantenimiento/mantenimiento.module').then( m => m.MantenimientoPageModule)
  },
  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full'
  },
  {
    path: 'rastreo',
    loadChildren: () => import('./paginas/rastreo/rastreo/rastreo.module').then( m => m.RastreoPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./paginas/rastreo/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
