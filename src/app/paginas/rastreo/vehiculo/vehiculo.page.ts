import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehiculoModelo } from '../../../modelos/vehiculo-modelo';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { ActionSheetController, AnimationController } from '@ionic/angular';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { LoadingController,ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.page.html',
  styleUrls: ['./vehiculo.page.scss'],

})
export class VehiculoPage implements OnInit {

  loading: HTMLIonLoadingElement;

  lista_vehiculos :Array<VehiculoModelo>=[];
  vehiculo_seleccionado=new VehiculoModelo();

  state: string = 'default';

  @ViewChild('circleTwo') circleTwo: ElementRef;
  
  constructor(
    private vehiculo_servicio:VehiculoService,
    public actionSheetController: ActionSheetController,
    private sms: SMS,
    private loadingController:LoadingController,
    public toastController: ToastController,
    private alertController: AlertController,

    // private animationCtrl: AnimationController
  ) { }


  ngOnInit() {
    this.GetVehiculos();
      
  }
  rotate() {

    
    // this.state = (this.state === 'default' ? 'rotated' : 'default');

    // this.circleTwo.nativeElement.style.transform = 'rotate('+ 290 +'deg)';
    
    // console.log("ver stad ",this.rotate);
    
  }
  async GetVehiculos() {

    await this.mostrar_loading();
    this.vehiculo_servicio.get_vehiculos_usuario().subscribe(data=>{

      this.ocultar_loading();
      this.lista_vehiculos=JSON.parse(JSON.stringify(data)).vehiculo;
      this.rotate();

    },error=>{
      console.log("errores  ",error);
      this.ocultar_loading();

    })
  }
  mostrar_opciones_vechiulo(placa:string,linea_gps:string){
    this.presentActionSheet(placa,linea_gps);
  }
  async apagar_motor(apagar:boolean,linea_gps:string) {

    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: (apagar==true)?'¿Esta seguro(a) de desactivar el motor?':'¿Esta seguro(a) de activar el motor?',
      message: 'Recuerde que es necesario tener un saldo mínimo de 0.20 centavos para esta operación',
      buttons: [        {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => { }
      },
      {
        text: 'Confirmar',
        role: 'confirm',
        handler: () => { 
          
          if(apagar){

            this.enviar_sms(linea_gps, 'DY');

          }else{

            this.enviar_sms(linea_gps, 'KY');

          }

         }
      }]
    });

    await alert.present();
  }
  enviar_sms(numero,mensaje){

    this.sms.send(numero, mensaje) .then(()=>{
      this.alerta("SMS Enviado");
    },(error)=>{
      this.alerta("Error, es posible que se encuentre sin saldo o probablemente ha rechazado los permisos para el envio de SMS");
      console.log("ver error ",error);
    });
  }
  async presentActionSheet(placa,linea_gps) {
    const actionSheet = await this.actionSheetController.create({

      header: 'VEHÍCULO '+placa,
      cssClass: 'action_sheet',
      buttons: [
      {
        text: 'Activar motor',
        icon: 'car-outline',
        data: 10,
        handler: () => {
          this.apagar_motor(false,linea_gps);
        }
      },
      {
        text: 'Desactivar motor',
        role: 'destructive',
        icon: 'car-outline',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          // console.log('Delete clicked');
          this.apagar_motor(true,linea_gps);
        }
      },
      // {
      //   text: 'Editar',
      //   icon: 'create-outline',
      //   data: 'Data value',
      //   handler: () => {
      //   }
      // }
      // , 
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
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
