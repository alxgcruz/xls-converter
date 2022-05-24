import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AppService } from 'src/app/services/app.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as dayjs from 'dayjs';
import { genEnum, multivaEnum, mifelEnum, stpEnum, bajioEnum, bbvaEnum, afirmeEnum, santanderEnum } from 'src/app/app.enums';
import { generic } from '../../app.interfaces';

@Component({
  selector: 'app-editor-panel',
  templateUrl: './editor-panel.component.html',
  styleUrls: ['./editor-panel.component.scss']
})
export class EditorPanelComponent implements OnInit {

  data: any[];
  dataBase: any[];
  header: any;
  messages: any[] = [];
  showMessage = false;

  dateReport: any;
  timeReport: any;

  constructor(public appService: AppService) {
    this.data = [];
    this.dataBase = [];
    this.header = [
      genEnum.ABONO,
      genEnum.CARGO,
      genEnum.FECHA_REPORTE,
      genEnum.HORA_REPORTE,
      genEnum.OBSERVACION,
      genEnum.CONCEPTO,
      genEnum.TIPO,
      genEnum.DIA,
      genEnum.MES,
      genEnum.ANIO,
      genEnum.HORA_MOVIMIENTO,
      genEnum.SALDO,
      genEnum.ID_INTERNO
    ];
  }

  ngOnInit(): void {

    this.appService.onClickEvent.subscribe((ev) => {
      switch (ev) {
        case 'download':
          this.printXls();
          break;
        case 'compare':
          this.compareFiles();
          break;
        default:
          break;
      }
    });
      
    this.appService.dataSource$.subscribe((data: any) => {
      // console.log(this.appService.formData);
      this.dateReport = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
      this.timeReport = this.appService.formData.time.toTimeString().substring(0,8);

      this.messages = [];
      switch (this.appService.formData.bank.bank) {
        case 'SANTANDER':
            this.santanderFormat(data);
          break;
        case 'SANTANDER DLS':
            this.santanderFormat(data);
          break;
        case 'MULTIVA':
            this.multivaFormat(data);
          break;
        case 'MIFEL':
            this.mifelFormat(data);
          break;
        case 'STP':
            this.stpFormat(data);
          break;
        case 'BANBAJIO':
            this.bajioFormat(data);
          break;
        case 'BBVA':
            this.bbvaFormat(data);
          break;
        case 'BBVA DLS':
            this.bbvaFormat(data);
          break;
        case 'AFIRME':
            this.afirmeFormat(data);
          break;
        default:
          break;
      }
    })

    this.appService.dataBase$.subscribe( (data: any) => {
      this.dataBase = data;
    })

    this.appService.onErrorEvent.subscribe(() => {
      this.showMessage = true;
    });

    this.appService.onClearEvent.subscribe(() => {
      this.showMessage = false;
      this.data = [];
    });
  }

  santanderFormat(data: any[]) {
    try {

      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map((registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[santanderEnum.FECHA].substring(1,3);
        reg.mes = registro[santanderEnum.FECHA].substring(3,5);
        reg.anio = registro[santanderEnum.FECHA].substring(5,9);
        reg.hora_movimiento = registro[santanderEnum.HORA];

        if(numDay != reg.dia) {
          numDay = reg.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        reg.id_interno = counterByDay;

        if(registro[santanderEnum.MOV] === '+') {
          reg.entrada = parseFloat(registro[santanderEnum.IMPORTE]);
          reg.salida = 0.00;
        } else {
          reg.entrada = 0.00;
          reg.salida = parseFloat(registro[santanderEnum.IMPORTE]);
        }
        reg.saldo = registro[santanderEnum.SALDO];
        registro[santanderEnum.DESC] = registro[santanderEnum.DESC].toString().trim();
        registro[santanderEnum.REF] = registro.hasOwnProperty(santanderEnum.REF) ? registro[santanderEnum.REF].toString().trim() : '';
        reg.concepto = registro.hasOwnProperty(santanderEnum.CONCEPTO) ? registro[santanderEnum.CONCEPTO].toString().trim() : '';
        
        if(!reg.concepto.length) {
          reg.observacion = registro[santanderEnum.DESC] + " " + registro[santanderEnum.REF];
          reg.tipo = this.defineType(reg.observacion, reg.entrada, reg.salida);
        } else {
          reg.observacion = '';
          reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
        }

        return reg;
      });
    } catch(err) {
      console.error(err);
      this.catchError('CAMBIAR EL FORMATO DE FECHA DE APLICACION A HH:MM * COPIAR Y PEGAR SOLO VALORES DE FECHA Y FECHA DE APLICACION');
    }
  }

  multivaFormat(data: any[]) {
    try {
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map((registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[multivaEnum.FECHA].substring(0,2);
        reg.mes = registro[multivaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        reg.hora_movimiento = registro[multivaEnum.HORA];
        
        reg.observacion = '';
        reg.concepto = registro[multivaEnum.DESC].toString().trim();
        reg.entrada = registro[multivaEnum.ABONO] ? this.formatNumber(registro[multivaEnum.ABONO]) : 0.00;
        reg.salida = registro[multivaEnum.CARGO] ? this.formatNumber(registro[multivaEnum.CARGO]) : 0.00;
        reg.saldo = this.formatNumber(registro[multivaEnum.SALDO]);
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
        
        return reg;
      });

      this.data = this.data.reverse();

      this.data = this.data.map( (registro: generic) => {
        if(numDay != registro.dia) {
          numDay = registro.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro.id_interno = counterByDay;
        return registro;
      });

    }catch(err) {
      console.error(err);
      this.catchError();
    }
  }

  mifelFormat(data: any[]) {
    try {
      let newData = [];
      let regReal: any = {};

      /** RECORRER LA TABLA PARA AGREGAR SOLO LOS QUE  */
      for (let index = 0; index < data.length; index++) {
        const registro = data[index];
        if ( !registro.hasOwnProperty(mifelEnum.NO) ) {
          let idx = newData.findIndex((value) => value[mifelEnum.NO] === regReal[mifelEnum.NO]);
          if (idx >= 0) {
            newData[idx][mifelEnum.DESC] += ' ' + registro[mifelEnum.DESC];
          }
        } else {
          regReal = registro;
          newData.push(regReal);
        }
      }

      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = newData.map( (registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[mifelEnum.FECHA].substring(0,2);
        reg.mes = registro[mifelEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        reg.hora_movimiento = '';
        
        if(numDay != reg.dia) {
          numDay = reg.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        reg.id_interno = counterByDay;

        reg.observacion = '';
        reg.concepto = registro[mifelEnum.DESC].trim();
        reg.entrada= registro.hasOwnProperty(mifelEnum.ABONO) ? this.formatNumber(registro[mifelEnum.ABONO]) : 0.00;
        reg.salida = registro.hasOwnProperty(mifelEnum.CARGO) ? this.formatNumber(registro[mifelEnum.CARGO]) : 0.00;
        reg.saldo = registro[mifelEnum.SALDO];
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);

        return reg;
      });

    } catch (error) {
      console.error(error);
      this.catchError('ELIMINAR LA INFORMACIÓN SUPERIOR * QUITAR ESPACIO EN CAMPO No. * QUITAR ESPACIO EN CAMPO Saldo *  QUITAR ESPACIO EN CAMPO Fecha');
    }


  }

  stpFormat(data: any[]) {
    try {
        
      let diaReg = '';
      let mesReg = '';
      let regReal: any = {};
      let newData = [];

      for (let index = 0; index < data.length; index++) {
        const registro = data[index];
        if (!registro.hasOwnProperty(stpEnum.MOV)) {
          diaReg = registro['Hora'].substring(0,2);
          mesReg = registro['Hora'].substring(3,5);
        } else {
          registro[stpEnum.DIA] = parseInt(diaReg);
          registro[stpEnum.MES] = parseInt(mesReg);
        }

        if ( registro.hasOwnProperty(stpEnum.ABONO) && registro.hasOwnProperty('Hora')) {
          regReal = registro;
          regReal['id'] = newData.length + 1;
          newData.push(regReal);
        } else {
          let idx = newData.findIndex((value) => value['id'] === regReal['id']);
          if (idx >= 0) {
            newData[idx][stpEnum.MOV] += ' ' + registro[stpEnum.MOV];
            if(registro.hasOwnProperty(stpEnum.ABONO)) {
              let quaPart = isNaN(registro[stpEnum.ABONO]) ? this.formatNumber(registro[stpEnum.ABONO]) : registro[stpEnum.ABONO];
              if(newData[idx][stpEnum.ABONO] === '- ') {
                newData[idx][stpEnum.ABONO] = 0.00;
              }
              newData[idx][stpEnum.ABONO] += quaPart;
            }
          }
        }
      }


      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = newData.map( registro => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = this.format2DigitNumber(registro[stpEnum.DIA]);
        reg.mes = this.format2DigitNumber(registro[stpEnum.MES]);
        reg.anio = this.appService.formData.date.getFullYear();
        reg.hora_movimiento = registro[stpEnum.HORA];
        
        if(numDay != reg.dia) {
          numDay = reg.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }

        reg.id_interno = counterByDay;
        reg.observacion = '';
        reg.concepto = registro[stpEnum.MOV].trim();

        if(registro[stpEnum.ABONO] === '- ') {
          reg.entrada = 0.00;
        } else {
          reg.entrada = isNaN(registro[stpEnum.ABONO]) ? this.formatNumber(registro[stpEnum.ABONO]) : registro[stpEnum.ABONO];
        }
        if(registro[stpEnum.CARGO] === '- ') {
          reg.salida = 0.00;
        } else {
          reg.salida = isNaN(registro[stpEnum.CARGO]) ? this.formatNumber(registro[stpEnum.CARGO]) : registro[stpEnum.CARGO];
        }
        reg.saldo = isNaN(registro[stpEnum.SALDO]) ? this.formatNumber(registro[stpEnum.SALDO]) : registro[stpEnum.SALDO];
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);

        return reg;
      });

    } catch (error) {
      console.error(error);
      this.catchError('ELIMINAR LA INFORMACIÓN SUPERIOR PARA DEJAR SOLO LA TABLA');
    }
  }

  bajioFormat(data: any[]) {
    try {
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map( registro => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[bajioEnum.FECHA_MOVIMIENTO].substring(0,2);
        reg.mes = this.format2DigitNumber(dayjs(registro[bajioEnum.FECHA_MOVIMIENTO]).get('month') + 1);
        reg.anio = this.appService.formData.date.getFullYear();
        reg.hora_movimiento = registro[bajioEnum.HORA];
        
        reg.observacion = '';
        reg.concepto = registro[bajioEnum.DESC].trim();
        reg.entrada = registro[bajioEnum.ABONOS];
        reg.salida = registro[bajioEnum.CARGOS];
        reg.saldo = registro[bajioEnum.SALDO];
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);

        return reg;
      });

      this.data = this.data.reverse();

      this.data = this.data.map((registro: generic) => {
        if(numDay != registro.dia) {
          numDay = registro.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro.id_interno = counterByDay;
        return registro;
      });

    } catch(err) {
      console.error(err);
      this.catchError('ELIMINAR LA INFORMACIÓN SUPERIOR E INFERIOR PARA DEJAR SOLO LA TABLA');
    }
  }

  bbvaFormat(data: any[]) {
    try {
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map( registro => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = '';

        reg.dia = registro[bbvaEnum.FECHA].substring(0,2);
        reg.mes = registro[bbvaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        
        reg.observacion = '';
        reg.concepto = registro[bbvaEnum.DESC].trim();

        reg.entrada = registro[bbvaEnum.ABONO] ? registro[bbvaEnum.ABONO] : 0.00;
        reg.salida = registro[bbvaEnum.CARGO] ? registro[bbvaEnum.CARGO] : 0.00;
        reg.saldo = registro[bbvaEnum.SALDO];
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);

        return reg;
      });

      this.data = this.data.reverse();

      this.data = this.data.map((registro: generic) => {
        if(numDay != registro.dia) {
          numDay = registro.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro.id_interno = counterByDay;
        return registro;
      });

    } catch (error) {
      console.error(error);
      this.catchError('QUITAR FILAS DE CABECERA Y ENTRE TABLAS DEL ARCHIVO');
    }
  }

  afirmeFormat(data: any[]) {
    try {
      
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map( (registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[afirmeEnum.FECHA].substring(0,2);
        reg.mes = registro[afirmeEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();

        if(numDay != reg.dia) {
          numDay = reg.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        reg.id_interno = counterByDay;

        reg.observacion = '';
        reg.concepto = registro[afirmeEnum.DESC].trim();

        let idx = reg.concepto.search('HORA:');
        reg.hora_movimiento = idx != -1 ? reg.concepto.slice(idx + 5, idx + 13).trim() : '';
        
        reg.entrada = registro[afirmeEnum.ABONO] ? registro[afirmeEnum.ABONO] : 0.00;
        reg.salida = registro[afirmeEnum.CARGO] ? registro[afirmeEnum.CARGO] : 0.00;
        reg.saldo = registro[afirmeEnum.SALDO];
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

    } catch (error) {
      console.error(error);
      this.catchError('QUITAR INFORMACIÓN DE CABECERA Y REVISE EL FORMATO DE LA FECHA');
    }
  }

  compareFiles() {
    let diffData: any[] = [];
    this.dataBase.forEach((element: generic) => {
      let idx = this.data.findIndex( (subel: generic) => {
        if(subel.dia === element.dia && subel.mes === element.mes && subel.id_interno === element.id_interno) {
          return subel;
        } else {
          return false;
        }
      });
      if(idx < 0) {
        diffData.push(element);
      }
    });

    let fechaActual = new Date().toLocaleString('es-MX', {day: '2-digit',month: 'long'});
    let name = 'DIFERENCIA ' + this.appService.formData.business.name;
    name += ' ' + this.appService.formData.bank.bank;
    name += ' ' + this.appService.formData.bank.account;
    name += ' ' + fechaActual;
    console.log('DESCARGAR XLS ', name);
    if(diffData.length) {
      this.exportAsExcelFile(diffData, name);
    }
  }

  initReg(): generic {
    return {
      entrada: 0,
      salida: 0,
      fecha_reporte: '',
      hora_reporte: '',
      observacion: '',
      concepto: '',
      tipo: '',
      dia: '0',
      mes: '0',
      anio: 0,
      hora_movimiento: '',
      saldo: 0,
      id_interno: 0,
    };
  }

  catchError(msg: string = '') {
    if(msg.length) {
      this.messages.push({severity:'error', summary: msg});
      this.showMessage = true;
    }
    this.data = []; 
  }

  /** FUNCIONES DE UTILIDAD */
  defineType(texto: string, entrada: number, salida: number): string {
    let tipo = '';

    if (entrada > 0 && salida > 0) {
      tipo = 'cancelado';
    } else if((texto.toLowerCase().includes('pago cheque') || 
        texto.toLowerCase().includes('pago de cheque') || 
        texto.toLowerCase().includes('pag cheq') || 
        texto.toLowerCase().includes('efectivo')) && 
        (entrada === 0 && salida > 0)) {
      tipo = 'efectivo';
    } else if ((texto.toLowerCase().includes('deposito') || 
                texto.toLowerCase().includes('depósito')) && 
                (entrada > 0 && salida === 0)) {
      tipo = 'deposito';
    } else {
      tipo = 'transferencia';
    }
    return tipo;
  }


  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Hoja1': worksheet }, 
      SheetNames: ['Hoja1'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' 
      });
      this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  private printXls() {
    /** CREAR NOMBRE DE ARCHIVO */
    let fechaActual = new Date().toLocaleString('es-MX', {day: '2-digit',month: 'long'});
    let name = this.appService.formData.business.name;
    name += " " + this.appService.formData.bank.bank;
    name += " " + this.appService.formData.bank.account;
    name += " " + fechaActual;
    console.log('DESCARGAR XLS ', name);
    if(this.data.length) {
      this.exportAsExcelFile(this.data, name);
    }
  }

  formatAMPM(date: Date) {
    let hours: number | string = date.getHours();
    let minutes: number | string = date.getMinutes();
    let ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  formatNumber(quantity: string): number {
    quantity = quantity.replace('(','');
    quantity = quantity.replace(')','');
    quantity = quantity.replace('$','');
    quantity = quantity.split(',').join('');
    return parseFloat(quantity);
  }

  format2DigitNumber(num: number): string {
    return num < 10 ? '0'.concat(num.toString()) : num.toString();
  }

}
