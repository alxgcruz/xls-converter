import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  version: string = 'v';

  constructor() { }

  ngOnInit(): void {
    this.version += '1.0.1';
  }

}
