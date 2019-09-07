import { NgModule } from '@angular/core';
import { BaseComponent, TemplateService } from '../public-api';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [BaseComponent],
  imports: [
    CommonModule
  ],
  exports: [BaseComponent],
  providers:[
    TemplateService
  ]
})
export class NgxManageModule { }
