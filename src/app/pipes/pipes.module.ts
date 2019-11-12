import { NgModule } from '@angular/core';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { TiempoPostPipe } from './tiempo-post.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { ImagenPipe } from './imagen.pipe';
import { FotoperfilPipe } from './fotoperfil.pipe';



@NgModule({
  declarations: [DomSanitizerPipe, TiempoPostPipe, ImageSanitizerPipe, ImagenPipe, FotoperfilPipe],
  exports: [ DomSanitizerPipe, TiempoPostPipe, ImageSanitizerPipe, ImagenPipe, FotoperfilPipe ]
})
export class PipesModule { }
