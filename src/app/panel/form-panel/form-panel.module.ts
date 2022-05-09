import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPanelComponent } from './form-panel.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [FormPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    FileUploadModule,
    ButtonModule,
    HttpClientModule,
    InputTextModule
  ],
  exports: [
    FormPanelComponent,
  ]
})
export class FormPanelModule { }
