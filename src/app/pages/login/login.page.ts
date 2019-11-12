import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from 'src/app/services/ui-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

loginUser = {
  email: '',
  password: ''
};

  constructor( private usuarioService: UsuarioService,
               private navCtrl: NavController,
               private uiService: UiServiceService) { }

  ngOnInit() {
  }

  async login( fLogin: NgForm ) {

    if ( fLogin.invalid ) { return; }

    const valido = await this.usuarioService.login( this.loginUser.email, this.loginUser.password );

    if ( valido ) {
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
    } else {
      this.uiService.mensajeAlerta('El usuario o contraseña no son correctos.');
    }
  }

  mostrarRegistro() {
    this.navCtrl.navigateRoot('/registro', { animated: true });
  }

  mostrarRecuperacion() {
    this.navCtrl.navigateRoot('/recuperar', { animated: true });
  }
}
