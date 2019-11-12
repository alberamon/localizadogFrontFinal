import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { MapaComponent } from './mapa/mapa.component';
import { FormsModule } from '@angular/forms';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { ComentarioComponent } from './comentario/comentario.component';
import { OpcionesPostComponent } from './opciones-post/opciones-post.component';
import { FiltroComponent } from './filtro/filtro.component';


@NgModule({
  declarations: [
    PostsComponent,
    PostComponent,
    MapaComponent,
    ComentariosComponent,
    ComentarioComponent,
    OpcionesPostComponent,
    FiltroComponent
  ],
  exports: [
    PostsComponent,
    ComentariosComponent,
    FiltroComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    FormsModule
  ],
  entryComponents: [ComentariosComponent,
                    OpcionesPostComponent,
                    FiltroComponent]
})
export class ComponentsModule { }
