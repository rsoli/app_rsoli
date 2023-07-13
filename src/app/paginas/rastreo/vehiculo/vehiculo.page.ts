import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehiculoModelo } from '../../../modelos/vehiculo-modelo';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { ActionSheetController, AnimationController } from '@ionic/angular';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { LoadingController,ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MonitoreoService } from 'src/app/servicios/monitoreo.service';
import { FormControl, FormGroup } from '@angular/forms';
import { GeocercaModelo } from 'src/app/modelos/geocerca-modelo';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.page.html',
  styleUrls: ['./vehiculo.page.scss']

})
export class VehiculoPage implements OnInit {

  form_geocerca!: FormGroup;
  lista_geocercas :Array<GeocercaModelo>=[];
  lista_geocercas_seleccionados: string[] = [];
  geocerca = new GeocercaModelo();
  // lista_geocercas_seleccionados :Array<GeocercaModelo>=[];
  @ViewChild(IonModal) modal: IonModal;
  

  lista_notificacion :Array<string>=[];
  lista_notificacion_seleccionados :Array<string>=[];

  loading: HTMLIonLoadingElement;
  lista_vehiculos :Array<VehiculoModelo>=[];
  vehiculo_seleccionado=new VehiculoModelo();

  id_vehiculo:number=0;

  state: string = 'default';


  isModalOpen = false;
  setOpen(isOpen: boolean) {
    console.log("lleog al modal ",isOpen);
    
    this.isModalOpen = isOpen;
  }

  @ViewChild('circleTwo') circleTwo: ElementRef;
  
  constructor(
    private vehiculo_servicio:VehiculoService,
    private monitoreo_servicio: MonitoreoService,
    public actionSheetController: ActionSheetController,
    private sms: SMS,
    private loadingController:LoadingController,
    public toastController: ToastController,
    private alertController: AlertController,
    private router: Router

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
      // console.log("ver ddd ",data);
      
      this.ocultar_loading();
      this.lista_vehiculos=JSON.parse(JSON.stringify(data)).vehiculo;
      //this.rotate();

    },error=>{
      console.log("errores  ",error);
      this.ocultar_loading();
      this.alerta("Revise su conexión a internet si el problema persiste vuelve a iniciar sesión");
      this.router.navigate(['/inicio']); 

    })
  }
  mostrar_opciones_vechiulo(placa:string,linea_gps:string,id_vehiculo,activar_motor:string,desactivar_motor:string){
    
    this.presentActionSheet(placa,linea_gps,id_vehiculo,activar_motor,desactivar_motor);
  }
  async apagar_motor(apagar:boolean,linea_gps:string,comando:string) {

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

            this.enviar_sms(linea_gps, comando);
            //this.enviar_sms(linea_gps, 'DY');

          }else{

            this.enviar_sms(linea_gps, comando);
            //this.enviar_sms(linea_gps, 'KY');

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
  async presentActionSheet(placa,linea_gps,id_vehiculo,activar_motor,desactivar_motor) {
    const actionSheet = await this.actionSheetController.create({

      header: 'VEHÍCULO '+placa,
      cssClass: 'action_sheet',
      buttons: [
      {
        text: 'Activar motor',
        icon: 'lock-closed-outline',
        data: 10,
        handler: () => {
          this.apagar_motor(false,linea_gps,activar_motor);
        }
      },
      {
        text: 'Desactivar motor',
        role: 'destructive',
        icon: 'lock-open-outline',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          // console.log('Delete clicked');
          this.apagar_motor(true,linea_gps,desactivar_motor);
        }
      },
      {
        text: 'Geocerca',
        role: 'destructive',
        icon: 'layers-outline',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          // console.log('Delete clicked');
          this.id_vehiculo=id_vehiculo;
          this.GetGeocercas();
          // this.modal_geocerca(id_vehiculo);
          //this.setOpen(!this.isModalOpen);
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
  modal_geocerca(id_vehiculo:number){

    console.log("llego id vehiculo ",id_vehiculo);
  }
  GetGeocercas(){
    this.mostrar_loading();

		this.monitoreo_servicio.get_geocercas_seleccionado(this.id_vehiculo).subscribe(data=>{
			this.ocultar_loading();
			this.lista_geocercas=JSON.parse(JSON.stringify(data)).lista_geocercas;
      this.lista_geocercas_seleccionados=JSON.parse(JSON.stringify(data)).lista_geocercas_seleccionados;
      this.lista_notificacion=JSON.parse(JSON.stringify(data)).lista_notificacion ;
      this.lista_notificacion_seleccionados=JSON.parse(JSON.stringify(data)).lista_notificacion_seleccionados ;
			console.log("ver res ultimo ",data );

      
      this.IniciarFormulario();
      
      let arrar_geocerca=new Array();
      let arrar_notificacion=new Array();
      var cantidad_geocerca = this.lista_geocercas_seleccionados.length;
      var cantidad_notificacion = this.lista_notificacion_seleccionados.length;
      for (let i = 0; i < cantidad_geocerca; i++) {
        arrar_geocerca.push(this.lista_geocercas_seleccionados[i]["id"]);
      }; 
      for (let i = 0; i < cantidad_notificacion; i++) {
        arrar_notificacion.push(this.lista_notificacion_seleccionados[i]["id_notificacion"]);
      }; 

      console.log(arrar_geocerca);
      
      this.form_geocerca.controls.lista_geocercas_seleccionados.setValue(arrar_geocerca);
      this.form_geocerca.controls.lista_notificacion_seleccionados.setValue(arrar_notificacion);
     
      this.isModalOpen=true;
		  },
      error=>{
        console.log("ver errores ",error);
      })
	}
  IniciarFormulario(){

    this.form_geocerca = new FormGroup({
      lista_geocercas_seleccionados: new FormControl(this.lista_geocercas_seleccionados),
      lista_notificacion_seleccionados: new FormControl(this.lista_notificacion_seleccionados),
    }); 

  }
  CerrarModal(){
    this.isModalOpen=false;
  }
  GuardarGeocerca(){

    this.mostrar_loading();
    let lista_geocercas=this.form_geocerca.controls.lista_geocercas_seleccionados.value;
    let lista_notificaciones = this.form_geocerca.controls.lista_notificacion_seleccionados.value;
    console.log(this.id_vehiculo,lista_geocercas,lista_notificaciones);

    let arrar_geocerca=[];
    let arrar_notificacion=[];

    for (let index = 0; index < lista_geocercas.length; index++) {
       arrar_geocerca.push({id:lista_geocercas[index]})
      //  arrar_notificacion.push({id_notificacion:lista_notificaciones[index]})
      //  console.log("xx ",lista_geocercas[index]);
    }
    for (let index = 0; index < lista_notificaciones.length; index++) {
      // arrar_geocerca.push({id:lista_geocercas[index]})
      arrar_notificacion.push({id_notificacion:lista_notificaciones[index]})
      // console.log("xx23 ",lista_notificaciones[index]);
    }
    
    this.monitoreo_servicio.post_geocerca_notificacion({id_vehiculo:this.id_vehiculo,lista_notificaciones_seleccionados:arrar_notificacion,lista_geocercas_seleccionados:arrar_geocerca}).subscribe(data=>{
      this.ocultar_loading();
      if(JSON.parse(JSON.stringify(data)).mensaje[0]){
        this.alerta(JSON.parse(JSON.stringify(data)).mensaje[0]);
      }else{
        // this.bsModalRef.hide();
        // this.isModalOpen=false;
        this.CerrarModal();
      }
    },error=>{
      this.ocultar_loading();
      this.alerta("Verifique su conexion a internet");
      console.log(error);
    });  

    console.log("llego geocerca ",this.form_geocerca.controls.lista_geocercas_seleccionados.value);
    
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log("confirmado");
    }
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
