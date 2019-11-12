import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-pass',
  templateUrl: './cambiar-pass.page.html',
  styleUrls: ['./cambiar-pass.page.scss'],
})
export class CambiarPassPage implements OnInit {

  boolPass = false;

  password;
  repetirPassword;
  textoPassword = '* La contraseña debe tener entre 4 y 12 caracteres alfanuméricos.';
  habilitarBoton = false;

  constructor(private usuarioService: UsuarioService,
              private uiService: UiServiceService,
              private navCtrl: NavController) { }

  ngOnInit() {
  }

  comprobarPass() {
    if (this.repetirPassword !== this.password) {
      this.textoPassword = 'Las contraseñas introducidas no coinciden.';
      this.boolPass = false;
      this.habilitarBoton = false;
    } else {
      this.boolPass = true;
      this.habilitarBoton = true;
    }
  }

  async cambiarPass() {

    const valido = await this.usuarioService.cambiarPass( this.password );

    if ( valido ) {
      this.uiService.mensajeAlerta('Contraseña cambiada con éxito');
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
    } else {
      this.uiService.mensajeAlerta('La contraseña no ha podido ser cambiada.');
    }
  }
}
