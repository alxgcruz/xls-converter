import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { EditorPanelComponent } from './editor-panel.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [EditorPanelComponent],
  imports: [
    CommonModule,
    TableModule,
    MessagesModule,
    MessageModule
  ],
  exports: [EditorPanelComponent]
})
export class EditorPanelModule { }
