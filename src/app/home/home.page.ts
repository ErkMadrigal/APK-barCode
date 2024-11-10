import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { DatosService } from '../services/datos.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  datos: any;

  scanResults = ''
  nombre = ''
  curp = ''
  telefono = ''
  id = '';
  message = '';
  status = '';

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private datosService: DatosService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}


  ngOnInit(): void {
    if(this.platform.is('capacitor')){
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();

    }
    // this.obtenerDatos("BOGM120523HDFLRSA8")
  }

  async startScan(){
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: { 
        formats: [],
        LensFacing: LensFacing.Back
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    // Verificar que el dato escaneado sea válido
    console.log('Resultado del escaneo:', data);
    if (data && data.barcode && data.barcode.displayValue) {
      this.scanResults = data.barcode.displayValue;

      // Llamada a obtenerDatos dentro de NgZone
      this.zone.run(() => {
        this.obtenerDatos(data.barcode.displayValue);
      });
    } else {
      console.warn('No se recibió un código válido.');
    }
  }

  obtenerDatos(code: string): void {
    this.datosService.getDatos(code).subscribe(
      (response) => {
        this.datos = response;
        console.log('Datos obtenidos:', this.datos);
        if(this.datos){
          this.status = "ok"
          this.id = this.datos.data.id
          this.nombre = `${this.datos.data.nombres} ${this.datos.data.apellidos}`;
          this.curp = this.datos.data.curp;
          this.telefono = this.datos.data.telefono;
          this.cdr.detectChanges();
  
          console.log("envio de mensaje whatsApp")
        }else{
          this.status = "error"
          this.message = "No se encontraron coincidencias en la BD"
        }
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  // ingresarDatos(id: string): void {
  //   this.datosService.setDatos(id).subscribe(
  //     (response) => {
  //       this.datos = response;
  //       console.log('Datos ingresados:', this.datos);
  //     },
  //     (error) => {
  //       console.error('Error al obtener datos:', error);
  //     }
  //   );
  // }

}
