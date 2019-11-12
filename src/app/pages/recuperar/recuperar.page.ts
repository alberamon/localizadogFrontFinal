import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  emailUser = '';
  enviandoEmail = false;

  constructor(private navCtrl: NavController,
              private uiService: UiServiceService,
              private usuarioService: UsuarioService) {}

  ngOnInit() {}

  async reestablecerPass( fReestablecer: NgForm ) {

    if ( fReestablecer.invalid ) {
      this.uiService.mensajeToast('Introduza un correo electrónico válido.');
      return;
    }

    this.enviandoEmail = true;

    const valido = await this.usuarioService.reestablecerPass( this.emailUser );

    if ( valido ) {
      this.enviandoEmail = false;
      this.uiService.mensajeAlerta('La nueva contraseña ha sido enviada a su correo electrónico.');
      this.navCtrl.navigateRoot('/login', { animated: true });
    } else {
      this.enviandoEmail = false;
      this.uiService.mensajeAlerta('El email introducido no corresponde a ningún usuario.');
    }
  }

  mostrarRegistro() {
    this.navCtrl.navigateRoot('/login', { animated: true });
  }
}
