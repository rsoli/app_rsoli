import { Component, OnInit } from '@angular/core';
import { UsuarioModelo } from '../../../modelos/usuario-modelo';
import { UsuarioService } from '../../../servicios/usuario.service';
import { LoadingController,ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  loading: HTMLIonLoadingElement;
  lista_usuarios :Array<UsuarioModelo>=[];
  usuario_seleccionado=new UsuarioModelo();

  constructor(
    private usuario_servicio:UsuarioService,
    private loadingController:LoadingController,
    public toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.GetUsuario();
  }
  async GetUsuario(){

    await this.mostrar_loading();
    this.usuario_servicio.get_usuarios().subscribe(data=>{

      this.ocultar_loading();
      this.lista_usuarios=JSON.parse(JSON.stringify(data)).usuarios;
      console.log("ver usuarios ",data);
      
    },error=>{
      console.log("errores  ",error);
      this.ocultar_loading();
      this.alerta("Revise su conexión a internet si el problema persiste vuelve a iniciar sesión");
      this.router.navigate(['/inicio']); 
    })
  }

  async mostrar_loading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando ...',
    });
    await this.loading.present();
  }
  ocultar_loading(){
    try {
      this.loading.dismiss();
    } catch (error) {
      console.log("Error al ocultar loading ",error);
    }
  }
  async alerta(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3500,
      position: 'middle'
    });
    toast.present();
  }

}
