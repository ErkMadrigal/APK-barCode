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
  telefono = ''
  emial = ''

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
    this.obtenerDatos("301006")
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
        this.nombre = `${this.datos.nombres} ${this.datos.paterno} ${this.datos.materno}`;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

}
