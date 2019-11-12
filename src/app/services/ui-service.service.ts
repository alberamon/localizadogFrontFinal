import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor( private alertCtrl: AlertController,
               private toastCtrl: ToastController ) { }

  async mensajeAlerta( message: string ) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async mensajeAlertaConfirmacion( message: string ): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertCtrl.create({
      header: 'Confirmacion',
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => resolveFunction(false)
        },
        {
          text: 'Si',
          handler: () => resolveFunction(true)
        }
      ]
    });
    await alert.present();
    return promise;
  }

  async mensajeToast( message: string ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'top',
      animated: true
    });
    toast.present();
  }
}
