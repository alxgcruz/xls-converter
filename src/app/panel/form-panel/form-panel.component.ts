import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { AppService } from '../../services/app.service';
import { BUSINESS, Business, Accounting } from '../../app.interfaces';

@Component({
  selector: 'app-form-panel',
  templateUrl: './form-panel.component.html',
  styleUrls: ['./form-panel.component.scss']
})
export class FormPanelComponent implements OnInit {

  businesses: Business[];
  accounts: Accounting[];

  constructor(public appService: AppService) {
    this.accounts = [];
    this.businesses = BUSINESS;
  }

  ngOnInit(): void {
  }

  changeBusiness(event: any){
    this.accounts = event.value.accounts;
  }

  onBasicUpload(event: any) {
    /* wire up file reader */
    if (event.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(event.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}

      this.appService.changeDataSource(data);
      // console.log(data); // Data will be logged in array format containing objects
    };
  }

  handleClick() {
    this.appService.buttonClicked();
  }

  onClearUpload() {
    this.appService.fileLoaded = false;
    this.appService.clearFired()
  }

  onErrorUpload() {
    this.appService.errorFired();
  }

}
