import { Component, OnInit, ViewChild } from '@angular/core';

import { TraccarService } from '../../../servicios/traccar.service';
import { CookieService } from 'ngx-cookie-service';

import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet.markercluster';
import { formatDate } from '@angular/common';
import DriftMarker from "leaflet-drift-marker";
import { MenuController, Platform,ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import * as moment from 'moment-timezone';
import { MonitoreoService } from 'src/app/servicios/monitoreo.service';

@Component({
  selector: 'app-rastreo',
  templateUrl: './rastreo.page.html',
  styleUrls: ['./rastreo.page.scss'],
})
export class RastreoPage implements OnInit {

  // lista_dispositivos: Array<String> = [];
  lista_dispositivos = new Array();
  lista_dispositivos_usuario: Array<String> = [];
  private timeout: any;
  loading: HTMLIonLoadingElement;

  texto: String = '';



  map: L.Map
  marker: any;
  markers = new Array();
  icon: any;
  icono_rojo :any;
  socket:any;
  contador_error:number=0;
  mapa_height=62;
  test='62%';
  // public data = [
  //   '5169-LCI',
  //   '5170-TXT',
  //   '4535-ERT',
  //   '3466-WEE',
  //   '3311-DDD',
  //   '9098-RTT',
  //   '3444-FFF',
  //   '5412-PPP',
  //   '4433-DDD',
  //   '9023-GDF',
  //   '4532-ZXS',
  // ];
  // public results = [...this.data];
  public results;

  hide_detalle=true;

  vehiculo_seleccionado ={lat:0,
                              lng:0,
                              id_dispositivo:0,
                              id_vehiculo:0,
                              placa: '',
                              motor: '',
                              bateria: ''
                            };
  id_vehiculo_aux=0;
  bandera_centrado_mapa=false;


  @ViewChild(IonModal) modal: IonModal;
  isModalOpen = false;
  fecha_ratreo_texto=moment(new Date()).format('DD-MM-YYYY');
  fecha_ratreo: any=new Date().toISOString();
  hora_inicio:any = moment(new Date('2023-10-06 00:00:00')).format('HH:mm');
  hora_fin:any = moment(new Date('2023-10-06 23:59:59')).format('HH:mm');
  
  lista_marcadores:any;
  polylines:any;
  contador_zoom_mapa:number=0;

  constructor(
    private traccar: TraccarService,
    private cookieService: CookieService,
    private platform: Platform,
    private loadingController:LoadingController,
    private router: Router,
    private menu: MenuController,
    public toastController: ToastController,
    private monitoreo_servicio:MonitoreoService,
  ) { 
  }

  ngOnInit() {
   
    this.cargarIcono();
    this.contador_error=0;
    this.platform.ready().then(() => {
      this.platform.pause.subscribe(() => {        
      
      });  
      this.platform.resume.subscribe(() => {      
          //alert("llego")
          window.location.reload();
      });
    });

  }

  handleInput(event) {
    const query = event.target.value.toLowerCase();
    this.lista_dispositivos = this.results.filter((d) => JSON.parse(JSON.stringify(d)).placa.toLowerCase().indexOf(query) > -1);
  }
  borrarMarcadores() {
    if(this.markers){

      for (let indice of this.markers){
        this.map.removeLayer(indice);

      }
    }
  
  }
  cargarIcono(){
    this.icon = {
      icon: L.icon({
        iconUrl: './assets/iconos/marcadores/circulo/ubi_azul.png',
        iconSize: [30, 35],
        iconAnchor: [17, 17],
        popupAnchor: [0, -13] //horizontal  vertical
      })
    };

    this.icono_rojo ={
      icon: L.icon({
        iconUrl: './assets/iconos/marcadores/circulo/ubi_rojo.png',
        iconSize: [30, 35],
        iconAnchor: [17, 17],
        popupAnchor: [0, -13] //horizontal  vertical
      })
    };

    // this.icono_rojo ={
    //   icon: L.icon({
    //     iconUrl: './assets/iconos/marcadores/circulo/ubi_rojo.png',
    //     iconSize: [25, 31],
    //     iconAnchor: [12, 28],
    //     popupAnchor: [-0, -27] //horizontal  vertical
    //   })
    // };
  }
  ionViewWillLeave() {

    this.DesconectarSocket();
    this.ngOnDestroy();
  }
  DesconectarSocket(){
    this.socket.onclose=function () {};
    this.socket.close();
    
  }

  ionViewDidEnter() {
    this.mostrar_loading();
    this.InicarSesion();
    this.lista_dispositivos_usuario = JSON.parse(localStorage.getItem('accesos') || '{}').Vehiculo;
    this.IniciarMapa(); 
    this.reconecta();
  } 
  async mostrar_loading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando ...',
    });
    await this.loading.present();
  }
  IniciarMapa() {

    var osm, controlCapas;

    this.map = L.map('map3', {
      center: [-16.6574403011881, -64.95190911770706],
      zoom: 5,
      
     

      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,

      // zoomDelta: 0.25,
      zoomSnap: 0.50,

      renderer: L.canvas(),


    })


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // attribution: '© OpenStreetMap',
      attribution: '',
      //updateWhenIdle: true,
      //reuseTiles: true
    }).addTo(this.map)

    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);
    

    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"/>OpenStreetMap</a>'
      attribution: '',
      //updateWhenIdle: true,
    }).addTo(this.map);


      // var Stadia_Outdoors =
      // L.tileLayer(
      //   'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
      //   maxZoom: 20,
      //   attribution: '',
      // });
      // var Stadia_OSMBright =
      // L.tileLayer(
      //   'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
      //   maxZoom: 20,
      //   attribution: '',
      // });

      var Stadia_AlidadeSmoothDark =
      L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        //attribution: 'Tiles &copy; Esri'
        //attribution: 'CartoDB.Voyager',
        attribution: '',
        maxZoom: 20,
        //updateWhenIdle: true,
      });

      var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });

      var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });



    var mapaBase = {
      'Osm': osm,
      //'Stamen_Toner': Stamen_Toner,
      //'Esri_WorldStreetMap': Esri_WorldStreetMap,
      //'Esri_WorldTopoMap': Esri_WorldTopoMap,
      // 'Stadia_Outdoors':Stadia_Outdoors,
      // 'Stadia_OSMBright':Stadia_OSMBright,
      'Stadia Oscuro':Stadia_AlidadeSmoothDark,
      'google Calles':googleStreets,
      'google Hibrido':googleHybrid
      // 'Cartografico':positron
    };

    var controlEscala;

    controlCapas = L.control.layers(mapaBase);
    controlCapas.addTo(this.map);


    controlEscala = L.control.scale();
    controlEscala.addTo(this.map);

    //solucion a problema de boton close de popop
    try {
      document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
        event.preventDefault();
      });
    } catch (error) {
      //borrar listener del clik close de marker
      document.removeEventListener(
        ".leaflet-pane.leaflet-popup-pane",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
        },
        false
      );
    }

  }
  InicarSesion() {
    this.traccar.post_iniciar_sesion().subscribe(data => {

      console.log("test", JSON.parse(JSON.stringify(data)));
      // let token =JSON.parse( JSON.stringify(data)).body.token;
      //this.GetMotorizado(token);
      //this.GetMotorizado();
      //this.ConectarSocket();
    },
      error => {
        console.log("errores ", error);

      })
  }
  GetMotorizado() {
    this.traccar.get_motorizado().subscribe(data => {

      //let token =JSON.parse( JSON.stringify(data)).token;

      this.lista_dispositivos = JSON.parse(JSON.stringify(data));

      this.lista_dispositivos_usuario = JSON.parse(localStorage.getItem('accesos') || '{}').Vehiculo;
      console.log("dispositvos test ", this.lista_dispositivos_usuario);
    },
      error => {

      })
  }
  ConectarSocket() {
    //this.traccar.conection(token);

    this.socket = new WebSocket("wss://www.kolosu.com/traccar/api/socket?token=xF0kSfghcnJgQlNQMt4cflWiinmOXa8z");
    
    this.socket.onopen = function (e) {
      //alert("[open] Connection established");
      //alert("Sending to server");
      console.log(" Connection established");
      //socket.send("My name is John");
      
    };

    this.socket.onmessage = function (event) {

      //alert(`[message] Data received from server: ${event.data}`);
    };

    this.socket.onclose = function (event) {
      if (event.wasClean) {
        //console.log(" Connection closed");
        //alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        //alert('[close] Connection died');

      }
    };

    this.socket.onerror = function (error) {
      //alert(`[error]`);

      console.log(" error socket 1");
    };

    this.socket.addEventListener('message', (event) => {
      this.AgregarMarcador(event);
     //console.log("llego ",event);
     
    });
    this.socket.addEventListener('open', (event) => {
      this.ngOnDestroy();
      this.ocultar_loading();
    });
    this.socket.addEventListener('close', (event) => {
      this.reconecta();
      
      this.contador_error++;
      if(this.contador_error==3){
        window.location.reload();
      }

      //this.ConectarSocket();
      console.log("close 3");
    });
    this.socket.addEventListener('error', (event) => {
      this.ngOnDestroy();
      console.log("error 2");
    });
  }
  ocultar_detalle(){

    this.hide_detalle=!this.hide_detalle;
    if(this.hide_detalle){
      this.mapa_height=62;
    }else{
      this.mapa_height=100;
    }

  }
  ocultar_loading(){
    try {
      this.loading.dismiss();
    } catch (error) {
      console.log("Error al ocultar loading ",error);
    }
  }
  RestaurarIconos(){
    //ponemos todos los iconos mismos tamaños

    
    // console.log(this.markers[position.deviceId] );

    for (let index = 0; index < this.lista_dispositivos.length; index++) {
        //agrandamos el marker seleccionado
        let id_dispositivo=this.lista_dispositivos[index].id_dispositivo;
        var icon2 = this.markers[id_dispositivo].options.icon;
        icon2.options.iconSize = [30, 35];
        icon2.options.iconAnchor = [17, 17];
        icon2.options.popupAnchor = [0, -13];//horizontal  vertical
        //icon.options.iconUrl = ((this.lista_dispositivos[index].motor=='Apagado')?'./assets/iconos/marcadores/circulo/ubi_rojo.png':'./assets/iconos/marcadores/circulo/ubi_azul.png'); 
        this.markers[id_dispositivo].setIcon(icon2);

    }

    
    //  this.map.eachLayer(function(layer) {
    //    if( layer instanceof L.Marker ) {
    //     var icon = layer.options.icon;
    //     icon.options.iconSize = [30, 35];
    //     icon.options.iconAnchor = [17, 17];
    //     icon.options.popupAnchor = [0, -13];//horizontal  vertical
        
    //     layer.setIcon(icon);
    //     }
    //  });
  }
  SeleccionarVehiculo(item:any){

    //similar a la funcion centar mapa
    this.map.closePopup();
    //this.RestaurarIconos();
    this.borrarMarcadores_rutas();
    if(this.polylines){
      this.polylines.removeFrom(this.map);
    }
    //this.centrar_mapa();

    //seleccionamos el vehiculo
    let id=item.id_dispositivo;
    this.vehiculo_seleccionado=item;

    //nos dirigimos hacia el marker
    let p=this.markers[id];
    if(this.id_vehiculo_aux==item.id_dispositivo){
      this.map.setView([p._latlng.lat, p._latlng.lng])
      
    }
    else{
      let id_aux = this.id_vehiculo_aux==0?item.id_dispositivo:this.id_vehiculo_aux;
      var icon2 = this.markers[id_aux].options.icon;
      icon2.options.iconSize = [30, 35];
      icon2.options.iconAnchor = [17, 17];
      icon2.options.popupAnchor = [0, -13];//horizontal  vertical
      this.markers[id_aux].setIcon(icon2);


      this.map.setView([p._latlng.lat, p._latlng.lng], 16);
      this.id_vehiculo_aux=item.id_dispositivo;
    }
    
    // this.map.flyTo([p._latlng.lat, p._latlng.lng]);
    // this.map.setView([p._latlng.lat, p._latlng.lng])

    //agrandamos el marker seleccionado
    var icon2 = this.markers[id].options.icon;
    icon2.options.iconSize = [35, 40];
    icon2.options.iconAnchor = [22, 22];
    icon2.options.popupAnchor = [0, -17];//horizontal  vertical
    this.markers[id].setIcon(icon2);

    //abrimos el popop
    this.markers[id].openPopup();


  }
  centrar_mapa(){
      this.map.fitBounds(this.lista_dispositivos);//mcentrar segun marcadores de socket
      this.vehiculo_seleccionado ={
        lat:0,
        lng:0,
        id_dispositivo:0,
        id_vehiculo:0,
        placa: '',
        motor: '',
        bateria: ''
      };
      this.map.closePopup();
      this.RestaurarIconos();
      this.borrarMarcadores_rutas();
      if(this.polylines){
        this.polylines.removeFrom(this.map);
      }
  }
  AgregarMarcador(event: any) {


    let data = JSON.parse(event.data);
    if (data.positions) {
      for (let i = 0; i < data.positions.length; i++) {


        let position = data.positions[i];

        //nuevo codigo
        let indice_device = this.lista_dispositivos_usuario.findIndex(device => JSON.parse(JSON.stringify(device)).id_dispositivo === position.deviceId);
        

        if (indice_device != -1) {
          //let marker = this.markers[position.deviceId];
          //this.marker = [position.latitude, position.longitude];
          let hora = new Date(position.deviceTime);
          if (!this.markers[position.deviceId]) {

            this.lista_dispositivos.push(
               {
                  lat:position.latitude,
                  lng:position.longitude,
                  id_dispositivo:position.deviceId,
                  id_vehiculo:JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).id_vehiculo,
                  placa: JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).placa,
                  //fecha :String(  formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + hora.toLocaleTimeString()),
                  motor: ((position.attributes.ignition==false)?'Apagado':'Encendido'),
                  bateria: (position.attributes.power)? (position.attributes.power.toFixed(1))+' V' : position.attributes.batteryLevel+'%'
               });
            this.results=this.lista_dispositivos;
            console.log(position);

           
            // marker = new DriftMarker(this.marker, icon);
            // this.markers[position.deviceId] = marker;

            if(position.attributes.ignition==false){
               this.markers[position.deviceId] = new DriftMarker([position.latitude, position.longitude], this.icono_rojo);
             }else{
                this.markers[position.deviceId] = new DriftMarker([position.latitude, position.longitude], this.icon);
             }



            
            this.markers[position.deviceId] = this.markers[position.deviceId];
            this.markers[position.deviceId].setRotationAngle(position.course);
            //console.log("ver posiciones ",position);
            

            this.markers[position.deviceId].bindPopup("<div style='font-size: 8px' > " +
              "<b>Placa :</b>  " + JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).placa + '<br/>' +
              "<b>Velocidad :</b>  " + (position.speed * 1.852).toFixed(1) + ' Km/h<br/>' +
              (position.deviceTime != null ? '<b>Fecha :</b> ' + formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + hora.toLocaleTimeString() + '<br/>' : '') +
              (position.attributes.batteryLevel != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.batteryLevel).toFixed(1) + '%<br/>' : '') +
              (position.attributes.battery != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.battery).toFixed(1) + ' Volt.<br/>' : '') +
              (position.attributes.power != null ? '<b>Bat vehículo :</b> ' + parseFloat(position.attributes.power).toFixed(1) + ' Volt.<br/>' : '') +
              (position.address != null ? '<b>Ubicación</b><br/> ' + position.address : '') +
              "<div> ");


              this.markers[position.deviceId].addTo(this.map);

            //console.log("actualizando1");

          } else {


            var icon_aux = this.markers[position.deviceId].options.icon;       
            icon_aux.options.iconUrl =((position.attributes.ignition==false)?'./assets/iconos/marcadores/circulo/ubi_rojo.png':'./assets/iconos/marcadores/circulo/ubi_azul.png'); 
            this.markers[position.deviceId].setIcon(icon_aux);

            //console.log("actualizando2");
            this.markers[position.deviceId].slideCancel(); 
            this.markers[position.deviceId].setRotationAngle(position.course);

            this.markers[position.deviceId].slideTo([position.latitude, position.longitude], {
              duration: 5000,
              keepAtCenter: (this.vehiculo_seleccionado.id_dispositivo==position.deviceId)?true:false,
            });

            //editar marker para lista de dispositivos
            let indice_lista_dispositivo = this.lista_dispositivos.findIndex(device => JSON.parse(JSON.stringify(device)).id_dispositivo === position.deviceId);
            this.lista_dispositivos[indice_lista_dispositivo].lat=position.latitude;
            this.lista_dispositivos[indice_lista_dispositivo].lng=position.longitude;
            this.lista_dispositivos[indice_lista_dispositivo].motor =((position.attributes.ignition==false)?'Apagado':'Encendido');
            this.lista_dispositivos[indice_lista_dispositivo].bateria= (position.attributes.power)? (position.attributes.power.toFixed(1))+' V' : position.attributes.batteryLevel+'%';
            

            this.markers[position.deviceId].bindPopup("<div style='font-size: 8px' > " +
              "<b>Placa :</b>  " + JSON.parse(JSON.stringify(this.lista_dispositivos_usuario[indice_device])).placa + '<br/>' +
              "<b>Velocidad :</b>  " + (position.speed * 1.852).toFixed(1) + ' Km/h<br/>' +
              (position.deviceTime != null ? '<b>Fecha :</b> ' + formatDate(position.deviceTime, 'dd/MM/yyyy ', 'en-US') + ' ' + hora.toLocaleTimeString() + '<br/>' : '') +
              (position.attributes.batteryLevel != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.batteryLevel).toFixed(1) + '%<br/>' : '') +
              (position.attributes.battery != null ? '<b>Bat gps :</b> ' + parseFloat(position.attributes.battery).toFixed(1) + ' Volt.<br/>' : '') +
              (position.attributes.power != null ? '<b>Bat vehículo :</b> ' + parseFloat(position.attributes.power).toFixed(1) + ' Volt.<br/>' : '') +
              (position.address != null ? '<b>Ubicación</b><br/> ' + position.address : '') +
              "<div> ");


              this.map.dragging.enable();//Activa movimiento del mapa despues de la animacion
          }
        }
        //// fi nuevo codigo


      }
      // console.log("ver datos ",this.lista_dispositivos);
      if(this.bandera_centrado_mapa==false){
        this.bandera_centrado_mapa=true;
        this.map.fitBounds(this.lista_dispositivos);
      }
       
      
    }


  }
  abrir_sidebar() {
    this.menu.enable(true, 'sidebar');
    this.menu.open('sidebar');
  }
  ngOnDestroy(): void {

    if (this.timeout) {
      console.log('clear timer ');
      clearInterval(this.timeout);
      this.timeout = null;
    }
  }
  reconecta() {

    this.timeout = setInterval(() => {
      
        this.ConectarSocket();

    }, 4000);

  }
  async alerta(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3400,
      position: 'middle'
    });
    toast.present();
  }

  //////////////////////////////////// rutas/////////////////////////////////////////////
  abrir_modal_rutas(item:any){

    this.isModalOpen = true;
    
  }
  cerrar_filtros() {
    this.isModalOpen = false;
  }
  onWillDismiss(event: Event) {
    this.isModalOpen = false;
    // const ev = event as CustomEvent<OverlayEventDetail<string>>;
    // if (ev.detail.role === 'confirm') {
    //   console.log("confirmado");
    // }
  }
  formatoFecha($ev) {
    console.log(moment($ev).format('DD-MM-YYYY'));
    this.fecha_ratreo_texto=moment($ev).format('DD-MM-YYYY');
  }
  async aplicar_filtros() {



    this.mostrar_loading();
    // this.centrar_mapa();
    this.ejecutar_filtros();
    this.isModalOpen = false;

    this.map.closePopup();
    this.RestaurarIconos();
    this.borrarMarcadores_rutas();
    this.vehiculo_seleccionado ={lat:0,
      lng:0,
      id_dispositivo:0,
      id_vehiculo:0,
      placa: '',
      motor: '',
      bateria: ''
    };

  }
  ejecutar_filtros(){
   
    let lista_vehiculos:any;
    let id_vehiculos_seleccionados='';
    let contador:any=0;
    
    id_vehiculos_seleccionados=this.vehiculo_seleccionado.id_vehiculo+'';
      
        // let fecha_ratreo: any=new Date().toISOString();
        let f_ini=moment(this.fecha_ratreo).format('YYYY/MM/DD')+' '+moment(new Date('2023-10-06 '+this.hora_inicio)).format('HH:mm');
        let f_fin=moment(this.fecha_ratreo).format('YYYY/MM/DD')+' '+moment(new Date('2023-10-06 '+this.hora_fin)).format('HH:mm');
       
        console.log("parametros ",{id_vehiculos:id_vehiculos_seleccionados,fecha_inicio:f_ini,fecha_fin:f_fin});
        
        this.monitoreo_servicio.post_monitoreo_rutas({id_vehiculos:id_vehiculos_seleccionados,fecha_inicio:f_ini,fecha_fin:f_fin}).subscribe(data=>{
          this.ocultar_loading();
          this.AgregarMarcador_rutas( JSON.parse(JSON.stringify(data)));
        },
        error=>{
          this.ocultar_loading();
          console.log("ver errores ",error);
        })
      
     
  }
  AgregarMarcador_rutas(marcadores:any) {
    

    this.borrarMarcadores_rutas();
    this.lista_marcadores=[];

    let linea_rutas=[];
    let lat:any;
    let lon:any;
    let contador:any=0;
    let icon:any;
    let lista_dispositivos = new Array(); //para centrar mapa segun rutas

    for (let indice of marcadores.lista_monitoreo_tiempo_real ){
      
        contador++;
        if(contador==1){

            icon = {
              icon: L.icon({
                    iconSize: [25, 31],
                    iconAnchor: [12, 31],
                    popupAnchor: [0, -29], 
                iconUrl: './assets/iconos/marcadores/ubicacion/ubi-rojo.svg',
              })
            };

        }else{

          if(contador==marcadores.lista_monitoreo_tiempo_real.length){
            icon = {
              icon: L.icon({
                iconSize: [25, 31],
                iconAnchor: [12, 31],
                popupAnchor: [0, -29],
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
             
                icon = {
                  icon: L.icon({
                    iconSize: [25, 31],
                    iconAnchor: [12, 31],
                    popupAnchor: [0, -29],
                    iconUrl: './assets/iconos/marcadores/ubicacion/ubi-amarillo.svg'
                  })
                };

            }

          }
        }


        this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
        
          // this.marker = L.marker([indice.latitude, indice.longitude], icon).addTo(this.map);
          this.marker.bindPopup("<div font-size: 10px; z-index:1000' > <div style='text-align: center;' > <b>DATOS DEL MOTORIZADO</b></div><br/>"+
          "<b>Placa :</b>  "+indice.placa+
          " <br> <b>Fecha :</b>  "+indice.devicetime+
          " <br> <b>Velocidad :</b>  "+parseFloat(indice.speed).toFixed(2)+" Km/h"+
          " <br> <b>Bateria :</b>  "+parseFloat(indice.bateria_vehiculo).toFixed(2)+" Volt."+
          " <br> <b>Tiempo parqueo :</b>  "+indice.tiempo_parqueo+
          " <br> <b>Ubicación :</b> </br>"+indice.address+ 
          "<div> ");


          lista_dispositivos.push(
            {
               lat:indice.latitude,
               lng:indice.longitude,
            });
        
        


        this.lista_marcadores.push(this.marker);   // ver si quitar o no por cluster agregado

        linea_rutas.push(this.marker.getLatLng());
        lat=indice.latitude;
        lon=indice.longitude;


    }

    if(this.polylines){
      this.polylines.removeFrom(this.map);
    }
    this.polylines = L.polyline(linea_rutas, {
      color: '#58ACFA', // color de linea
      // weight: 7, // grosor de línea
      weight: 6, // grosor de línea
    }).addTo(this.map);
    
    // this.map.fitBounds(this.polylines.getBounds());

    if(linea_rutas.length>0){

      this.map.fitBounds(lista_dispositivos);//centar mapa segun rutas
      
    }else{
      this.alerta('No existe datos en la fecha');
    }
    

    //solucion a problema de boton close de popop
    try {
      document.querySelector('.leaflet-pane.leaflet-popup-pane')!.addEventListener('click', event => {
        event.preventDefault();
      });
    } catch (error) {
      //borrar listener del clik close de marker
      document.removeEventListener(
        ".leaflet-pane.leaflet-popup-pane",
        function (event) {
        event.preventDefault();
        event.stopPropagation();
        },
        false
        );
    }

    
  }
  borrarMarcadores_rutas() {
    if(this.lista_marcadores){
      for (let indice of this.lista_marcadores){
        this.map.removeLayer(indice);
      }
    }
  }

}
