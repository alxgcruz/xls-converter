import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Bank, Business } from '../app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private dataSource = new Subject();
  public dataSource$ = this.dataSource.asObservable();

  private clickEvent = new Subject();
  public onClickEvent = this.clickEvent.asObservable();
  
  private errorEvent = new Subject();
  public onErrorEvent = this.errorEvent.asObservable();
  
  private clearEvent = new Subject();
  public onClearEvent = this.clearEvent.asObservable();

  public formData: {
    date: Date;
    time: Date;
    business: Business;
    bank: Bank;
  };

  public fileLoaded: boolean;

  
  // private formData = new Subject();
  // public formData$ = this.formData.asObservable();

  constructor() {
    this.formData = {
      date: new Date(),
      time: new Date(),
      business: new Business('FJ',[{bank: 'SANTANDER', account: ''}]),
      bank: {bank: 'SANTANDER', account: ''},
    };
    this.fileLoaded = false;
  }

  changeDataSource(data: any[]) {
    this.fileLoaded = true;
    this.dataSource.next(data);
  }

  buttonClicked() {
    this.clickEvent.next();
  }

  errorFired() {
    this.errorEvent.next();
  }

  clearFired() {
    this.clearEvent.next();
  }
}
