import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';

import { ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import * as moment from 'moment-timezone';
import { MonitoreoService } from '../../../servicios/monitoreo.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.page.html',
  styleUrls: ['./monitoreo.page.scss'],
})
export class MonitoreoPage implements OnInit {

  loading: HTMLIonLoadingElement;

  map: L.Map
  @ViewChild(IonModal) modal: IonModal;
  marker: any;
  lista_marcadores:any;
  polylines:any;

  name: string; //modal filtro
  

  tipo_monitoreo_seleccionado=[];
  tipo_monitoreo: any[];
  fecha_ratreo: any=new Date().toISOString();
  fecha_ratreo_texto=moment(new Date()).format('DD-MM-YYYY');
  hora_inicio:any = moment(new Date('2023-10-06 01:00:00')).format('HH:mm');
  hora_fin:any = moment(new Date('2023-10-06 23:59:59')).format('HH:mm');


  vehiculo_seleccionado=[];
  vehiculo: any[];

  contador_zoom_mapa:number=0;
  bandera_timer:boolean=false;
  bandera_tipo_monitoreo:boolean=true;
  limite_seleccion_vehiculos:number=1;
  id_interval:any;

  
  constructor(
    public platform: Platform,
    private monitoreo_servicio:MonitoreoService,
    private loadingController:LoadingController,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.IniciarMapa();
      this.cargarTipoMonitoreo();
      this.IniciarFiltros();
    });
  }

  IniciarMapa(){

    var  osm, controlCapas;

    this.map = L.map('map', {
      center: [-16.6574403011881, -64.95190911770706],
      zoom: 5,

      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,

      renderer: L.canvas()
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map)
    
    setTimeout(() => {
      this.map.invalidateSize();
    }, 10);

    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
    }).addTo(this.map);

    var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
    });

    var Stamen_Toner = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com"/>Stamen Design</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    });
          
    var Esri_WorldStreetMap = 
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });

    var Esri_WorldTopoMap =
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });
    var Esri_WorldImagery =
        L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri'
            });



    var mapaBase = {
        'OSM': osm,
        'OpenStreetMap_HOT': OpenStreetMap_HOT,
        'Stamen_Toner': Stamen_Toner,
        'Esri_WorldStreetMap': Esri_WorldStreetMap,
        'Esri_WorldTopoMap': Esri_WorldTopoMap,
        'Satelite': Esri_WorldImagery,
    };

    var SafeCast = L.tileLayer('https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href=" ">CC-BY-SA</a>)'
    });
    // var overlay = {"Safecat":SafeCast}


    var controlEscala;

    // controlCapas = L.control.layers(mapaBase, overlay);
    controlCapas = L.control.layers(mapaBase);
    controlCapas.addTo(this.map);

    controlEscala = L.control.scale();
    controlEscala.addTo(this.map);

   
  }
  formatoFecha($ev) {
    // console.log('date', moment(date).format('YYYY-MM-DD')); 
    console.log(moment($ev).format('DD-MM-YYYY'));
    this.fecha_ratreo_texto=moment($ev).format('DD-MM-YYYY');
  }

  cargarTipoMonitoreo() {
    this.tipo_monitoreo = [
      { nombre: 'Tiempo real', code: 'tiempo_real' },
      { nombre: 'Rutas', code: 'rutas' },
    ];
    this.tipo_monitoreo_seleccionado=['tiempo_real' ];
  }
  IniciarFiltros(){

    this.mostrar_loading();
    this.monitoreo_servicio.get_filtros_monitoreo().subscribe(data=>{
      this.ocultar_loading();
      this.vehiculo=JSON.parse(JSON.stringify(data)).lista_vehiculo;
    },
    error=>{
      this.ocultar_loading();
    })

  }
  cerrar_filtros() {
    this.modal.dismiss(null, 'cancel');
  }
  monitoreo_seleccionado(event: any){
    try {
      // this.BorrarTimer();
      this.ngOnDestroy();
      this.fecha_ratreo=new Date().toISOString();
      this.hora_inicio=moment(new Date('2023-10-06 01:00:00')).format('HH:mm');
      this.hora_fin=moment(new Date('2023-10-06 23:59:59')).format('HH:mm');
      
      this.vehiculo_seleccionado=[];
      if(event.detail.value=="tiempo_real"){
        this.limite_seleccion_vehiculos=2147483647; //esta variable no se usa en ionic
        this.bandera_tipo_monitoreo=true;
      }else{
        this.limite_seleccion_vehiculos=1;  //esta variable no se usa en ionic
        this.bandera_tipo_monitoreo=false;
      }
    } catch (error) {

    }

  }
  ejecutar_filtros(){
   
    let lista_vehiculos:any;
    let id_vehiculos_seleccionados='';
    let contador:any=0;
    
    if(String(this.tipo_monitoreo_seleccionado) =='tiempo_real'){//cambio logica agregado para ionic 
      // console.log("ver lista vehiculos tiempo real ",this.vehiculo_seleccionado);
      lista_vehiculos= JSON.parse(JSON.stringify(this.vehiculo_seleccionado));
      id_vehiculos_seleccionados='';
    }else{
      // console.log("ver lista vehiculos rutas ",this.vehiculo_seleccionado);
      lista_vehiculos= [JSON.parse(JSON.stringify(this.vehiculo_seleccionado))];
      id_vehiculos_seleccionados='';
    }
    
    for (let clave of lista_vehiculos){
      contador++;
      if(contador==lista_vehiculos.length){
        id_vehiculos_seleccionados+=clave.id_vehiculo;
      }else{
        id_vehiculos_seleccionados+=clave.id_vehiculo+',';
      }
    }
    // console.log("ver vehiculos ",this.vehiculo_seleccionado);
    
    if(String(this.tipo_monitoreo_seleccionado) =='tiempo_real'){

      this.monitoreo_servicio.post_monitoreo_tiempo_real({id_vehiculos:id_vehiculos_seleccionados}).subscribe(data=>{
        this.ocultar_loading();
        this.AgregarMarcador( JSON.parse(JSON.stringify(data)));
      },
      error=>{
        this.ocultar_loading();
        console.log("ver errores ",error);
      })
      this.bandera_timer=true;

    }
     else{
      //  this.mostrar_loading();

      //  formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')
      //  let f_ini=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_inicio.toLocaleTimeString();
      //  let f_fin=formatDate(this.fecha_ratreo, 'yyyy/MM/dd', 'en-US')+' '+this.hora_fin.toLocaleTimeString();
       let f_ini=moment(this.fecha_ratreo).format('YYYY/MM/DD')+' '+moment(new Date('2023-10-06 '+this.hora_inicio)).format('HH:mm');
       let f_fin=moment(this.fecha_ratreo).format('YYYY/MM/DD')+' '+moment(new Date('2023-10-06 '+this.hora_fin)).format('HH:mm');
       
       
       this.monitoreo_servicio.post_monitoreo_rutas({id_vehiculos:id_vehiculos_seleccionados,fecha_inicio:f_ini,fecha_fin:f_fin}).subscribe(data=>{
         this.ocultar_loading();
        
         this.AgregarMarcador( JSON.parse(JSON.stringify(data)));
       },
       error=>{
         this.ocultar_loading();
         console.log("ver errores ",error);
       })
     }
  }
  AgregarMarcador(marcadores:any) {

    this.borrarMarcadores();
    this.lista_marcadores=[];

    let linea_rutas=[];
    let lat:any;
    let lon:any;
    let contador:any=0;
    let icon:any;

    for (let indice of marcadores.lista_monitoreo_tiempo_real ){
      
        contador++;
        if(contador==1){

          if( String(this.tipo_monitoreo_seleccionado) =="tiempo_real"){
            icon = {
              icon: L.icon({
                iconSize: [25, 31],
                iconAnchor: [12, 31],
                iconUrl: './assets/iconos/marcadores/ubicacion/ubi-azul.svg',
              })
            };
          }else{
            icon = {
              icon: L.icon({
                iconSize: [25, 31],
                iconAnchor: [12, 31],
                iconUrl: './assets/iconos/marcadores/ubicacion/ubi-rojo.svg',
              })
            };
          }

        }else{
          if(contador==marcadores.lista_monitoreo_tiempo_real.length){
            icon = {
              icon: L.icon({
                iconSize: [25, 31],
                iconAnchor: [12, 31],
                iconUrl: './assets/iconos/marcadores/ubicacion/ubi-azul.svg',
              })
            };
          }else{
            if(indice.tiempo_parqueo=='00:00:00'){
              icon = {
                icon: L.icon({
                  // iconSize: [20, 8],
                  // iconAnchor: [7, 3],
                  iconSize: [8, 10],
                  iconAnchor: [4, 3],
                  iconUrl: './assets/iconos/marcadores/flecha/flecha-azul2.svg',
                }),
                rotationAngle:indice.course
              };
            }
            else{
              if( String(this.tipo_monitoreo_seleccionado) =="tiempo_real"){
                icon = {
                  icon: L.icon({
                    iconSize: [25, 31],
                    iconAnchor: [12, 31],
                    iconUrl: './assets/iconos/marcadores/ubicacion/ubi-azul.svg',
                  })
                };
              }else{
                icon = {
                  icon: L.icon({
                    iconSize: [25, 31],
                    iconAnchor: [12, 31],
                    iconUrl: './assets/iconos/marcadores/ubicacion/ubi-amarillo.svg'
                  })
                };
              }

            }

          }
        }

        if(indice.tiempo_parqueo=='00:00:00'){
          this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
          this.marker.bindPopup("<div font-size: 10px; z-index:1000' > <div style='text-align: center;' > <b>DATOS DEL MOTORIZADO</b></div><br/>"+
          "<b>Placa :</b>  "+indice.placa+
          " <br> <b>Fecha :</b>  "+indice.devicetime+
          " <br> <b>Velocidad :</b>  "+parseFloat(indice.speed).toFixed(2)+" Km/h"+
          " <br> <b>Bateria :</b>  "+parseFloat(indice.bateria_vehiculo).toFixed(2)+" Volt."+
          " <br> <b>Ubicación :</b> </br>"+indice.address+ 
          "<div> ");
        }else{
          this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
          this.marker.bindPopup("<div font-size: 10px; z-index:1000' > <div style='text-align: center;' > <b>DATOS DEL MOTORIZADO</b></div><br/>"+
          "<b>Placa :</b>  "+indice.placa+
          " <br> <b>Fecha :</b>  "+indice.devicetime+
          " <br> <b>Velocidad :</b>  "+parseFloat(indice.speed).toFixed(2)+" Km/h"+
          " <br> <b>Bateria :</b>  "+parseFloat(indice.bateria_vehiculo).toFixed(2)+" Volt."+
          " <br> <b>Tiempo parqueo :</b>  "+indice.tiempo_parqueo+
          " <br> <b>Ubicación :</b> </br>"+indice.address+ 
          "<div> ");
        }
        
        this.lista_marcadores.push(this.marker);

        linea_rutas.push(this.marker.getLatLng());
        lat=indice.latitude;
        lon=indice.longitude;


    }

    if(this.polylines){
      this.polylines.removeFrom(this.map);
    }

    if(linea_rutas.length>0){

      
      if( String( this.tipo_monitoreo_seleccionado) !="tiempo_real"){
        this.polylines = L.polyline(linea_rutas, {
          color: '#58ACFA', // color de linea
          // weight: 7, // grosor de línea
          weight: 6, // grosor de línea
        }).addTo(this.map);
        
        this.map.fitBounds(this.polylines.getBounds());
      }
      if(this.contador_zoom_mapa==0){
        this.map.setView([lat, lon], 16);  
      }else{
        if(linea_rutas.length==1){
          this.map.setView([lat, lon]);  
        }else{
          this.map.setView([lat, lon], 5);  
          // agregar logica en caso de ser necesario 
        }
      }
      this.contador_zoom_mapa++;
      
    }else{
      // this.BorrarToast();
      this.alerta('No existe datos en la fecha');
    }

    //solucion a problema de boton close de popop
    document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
      event.preventDefault();
    });
    
  }
  borrarMarcadores() {
    if(this.lista_marcadores){
      for (let indice of this.lista_marcadores){
        this.map.removeLayer(indice);
      }
    }
  }
  aplicar_filtros() {

    this.map.setView([-16.6574403011881, -64.95190911770706], 5); 

    console.log("ver aplciar filtros ",this.tipo_monitoreo_seleccionado );
    
    this.modal.dismiss(null, 'cancel');
    // console.log("ver res ",this.tipo_monitoreo_seleccionado);
    this.contador_zoom_mapa=0;
    // this.visibleSidebar1=false;
    if(this.vehiculo_seleccionado.length==0){
      this.alerta('El campo vehiculo es requerido');
    }else{
      if(this.tipo_monitoreo_seleccionado==undefined){
        this.alerta('El campo tipo de monitoreo es requerido');
      }else{
        if( String(this.tipo_monitoreo_seleccionado) !='tiempo_real'){
          this.bandera_timer=false;
          if(!this.fecha_ratreo){
            this.alerta('El campo fecha es requerido');
          }else{
            if(!this.hora_inicio){
              this.alerta('El campo hora inicio es requerido');
            }else{
              if(!this.hora_fin){
                this.alerta('El campo hora fin es requerido');
              }else{
                this.mostrar_loading();
                this.ejecutar_filtros();
                // this.visibleSidebar1=false;
                this.modal.dismiss(null, 'cancel');
                console.log("llego if tiempo real");
                
              }
            }
          }
        }
        else{
          this.mostrar_loading();
          this.TiempoInterval();
          // this.visibleSidebar1=false;
          this.modal.dismiss(null, 'cancel');
          console.log("llego else");
        }
      }
    }

  }
  TiempoInterval(){

    this.id_interval = setInterval( () => {
      try {
        if(String(this.tipo_monitoreo_seleccionado)=='tiempo_real'){
          this.ejecutar_filtros(); 
        }
      } catch (error) {
        console.log("erores timer");
        
      }
    }, 7000);

  }
  ngOnDestroy() {//no es necesario invocarlo se destruye automatico en ionic
    if (this.id_interval) {
      clearInterval(this.id_interval);
    }
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
      duration: 3400,
      position: 'middle'
    });
    toast.present();
  }

}
