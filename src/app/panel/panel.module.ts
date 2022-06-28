import { NgModule } from '@angular/core';

import { PanelRoutingModule } from './panel.routing.module';
import { PanelComponent } from './panel.component';
import { FormPanelModule } from './form-panel/form-panel.module';
import { EditorPanelModule } from './editor-panel/editor-panel.module';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    PanelComponent
  ],
  imports: [
    PanelRoutingModule,
    FormPanelModule,
    EditorPanelModule,
    CardModule,
    TooltipModule
  ],
  exports: [
    PanelComponent],
})
export class PanelModule { }
