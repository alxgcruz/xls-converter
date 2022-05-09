import { NgModule } from '@angular/core';

import { PanelRoutingModule } from './panel.routing.module';
import { PanelComponent } from './panel.component';
import { FormPanelModule } from './form-panel/form-panel.module';
import { EditorPanelModule } from './editor-panel/editor-panel.module';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    PanelRoutingModule,
    FormPanelModule,
    EditorPanelModule,
    CardModule
  ],
  exports: [
    PanelComponent],
})
export class PanelModule { }
