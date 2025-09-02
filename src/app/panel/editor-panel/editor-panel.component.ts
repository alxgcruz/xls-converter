import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { afirmeEnum, alquimiaEnum, aspEnum, aztecaEnum, bajioEnum, banorteEnum, banregioEnum, bbvaEnum, genEnum, hsbcEnum, mifelEnum, multivaEnum, praxiEnum, santanderEnum, stpEnum } from 'src/app/app.enums';
import { AppService } from 'src/app/services/app.service';
import * as XLSX from 'xlsx';
import { generic } from '../../app.interfaces';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
        case 'ASP INTEGRA':
            this.aspFormat(data);
          break;
        case 'BANORTE':
            this.banorteFormat(data);
          break;
        case 'BANREGIO':
            this.banregioFormat(data);
          break;
        case 'ALQUIMIA':
            this.alquimiaFormat(data);
          break;
        case 'AZTECA':
            this.aztecaFormat(data);
          break;
        case 'HSBC':
            this.hsbcFormat(data);
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
        
        reg.observacion = `${registro[santanderEnum.REF] || ''} ${registro[santanderEnum.CVE] || '' }`;
        
        reg.tipo = reg.concepto.length ? this.defineType(reg.concepto, reg.entrada, reg.salida) : this.defineType(reg.observacion, reg.entrada, reg.salida);

        return reg;
      });
    } catch(err) {
      console.error(err);
      this.catchError('CAMBIAR EL FORMATO DE FECHA DE APLICACION A HH:MM * COPIAR Y PEGAR SOLO VALORES DE FECHA Y FECHA DE APLICACION');
    }
  }

  multivaFormat(data: any[]) {
    try {

      this.data = data.map((registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[multivaEnum.FECHA].substring(0,2);
        reg.mes = registro[multivaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        reg.hora_movimiento = registro[multivaEnum.HORA];
        
        reg.observacion = registro[multivaEnum.REF] ? registro[multivaEnum.REF].toString().trim() : '';
        reg.concepto = registro[multivaEnum.DESC].toString().trim();
        reg.entrada = registro[multivaEnum.ABONO] ? this.formatNumber(registro[multivaEnum.ABONO]) : 0.00;
        reg.salida = registro[multivaEnum.CARGO] ? this.formatNumber(registro[multivaEnum.CARGO]) * -1 : 0.00;
        reg.saldo = this.formatNumber(registro[multivaEnum.SALDO]);
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
        
        return reg;
      });

      this.data = this.reverseArray(this.data);

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

        reg.observacion = registro[mifelEnum.FOP] ? registro[mifelEnum.FOP].trim() : '';
        reg.concepto = registro[mifelEnum.DESC].trim();
        reg.entrada = registro.hasOwnProperty(mifelEnum.ABONO) ? this.formatNumber(registro[mifelEnum.ABONO]) : 0.00;
        reg.salida = registro.hasOwnProperty(mifelEnum.CARGO) ? this.formatNumber(registro[mifelEnum.CARGO]) : 0.00;
        reg.saldo = this.formatNumber(registro[mifelEnum.SALDO]);
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
        if (!registro.hasOwnProperty(stpEnum.MOV) && !registro.hasOwnProperty(stpEnum.TRX) ) {
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
            if(registro.hasOwnProperty(stpEnum.MOV)){
              newData[idx][stpEnum.MOV] += ' ' + registro[stpEnum.MOV];
            }
            if(registro.hasOwnProperty(stpEnum.TRX)){
              newData[idx][stpEnum.TRX] += ' ' + registro[stpEnum.TRX];
            }
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
        if(registro.hasOwnProperty(stpEnum.MOV)){
          reg.concepto = registro[stpEnum.MOV].trim();
        }
        if(registro.hasOwnProperty(stpEnum.TRX)){
          reg.concepto = registro[stpEnum.TRX].trim();
        }

        reg.entrada = registro[stpEnum.ABONO] === '- ' ? 0.00 : this.formatNumber(registro[stpEnum.ABONO]);
        reg.salida = registro[stpEnum.CARGO] === '- ' ? 0.00 : this.formatNumber(registro[stpEnum.CARGO]);
        reg.saldo = this.formatNumber(registro[stpEnum.SALDO]);
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

      this.data = data.map( registro => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[bajioEnum.FECHA_MOVIMIENTO].substring(0,2);
        reg.mes = this.formatMonth(registro[bajioEnum.FECHA_MOVIMIENTO].substring(3,6));
        
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

      this.data = this.reverseArray(this.data);

    } catch(err) {
      console.error(err);
      this.catchError('ELIMINAR LA INFORMACIÓN SUPERIOR E INFERIOR PARA DEJAR SOLO LA TABLA');
    }
  }

  bbvaFormat(data: any[]) {
    try {
      let newData = [];
      let regReal: any = {};

      /** RECORRER LA TABLA PARA AGREGAR SOLO LOS QUE  */
      for (let index = 0; index < data.length; index++) {
        const registro = data[index];
        if ( !registro.hasOwnProperty(bbvaEnum.FECHA) && registro.hasOwnProperty(bbvaEnum.DESC) ) {
          newData[newData.length - 1][bbvaEnum.DESC] += ' ' + registro[bbvaEnum.DESC];
        } else {
          regReal = registro;
          newData.push(regReal);
        }
      }

      this.data = newData.map( registro => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = '';

        reg.dia = registro[bbvaEnum.FECHA].substring(0,2);
        reg.mes = registro[bbvaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        
        reg.observacion = '';
        reg.concepto = registro[bbvaEnum.DESC].trim();

        reg.entrada = registro[bbvaEnum.ABONO] ? this.formatNumber(registro[bbvaEnum.ABONO]) : 0.00;
        reg.salida = registro[bbvaEnum.CARGO] ? this.formatNumber(registro[bbvaEnum.CARGO]) : 0.00;
        reg.saldo = this.formatNumber(registro[bbvaEnum.SALDO]);
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);

        return reg;
      });

      this.data = this.reverseArray(this.data);

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

  aspFormat(data: any[]) {
    try {
      this.data = data.map( (registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = registro[aspEnum.FECHA].substring(11,registro[aspEnum.FECHA].length);
        reg.dia = registro[aspEnum.FECHA].substring(8,10);
        reg.mes = registro[aspEnum.FECHA].substring(5,7);
        reg.anio = this.appService.formData.date.getFullYear();

        reg.observacion = '';
        reg.concepto = registro[aspEnum.DESC].trim();

        reg.entrada = registro[aspEnum.ABONO] ? this.formatNumber(registro[aspEnum.ABONO]) : 0.00;
        if(registro[aspEnum.CARGO]) {
          let cargo = this.formatNumber(registro[aspEnum.CARGO]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
        } else {
          reg.salida = 0.00;
        }
        reg.saldo = 0;
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

      this.data = this.reverseArray(this.data);

    } catch (error) {
      console.error(error);
      this.catchError('QUITAR INFORMACIÓN DE CABECERA Y REVISE EL FORMATO DE LA FECHA');
    }
  }

  banorteFormat(data: any[]) {
    try {

      if(this.appService.formData.business.name === 'PRAXI') {
        this.praxiBanorte(data);
      } else {
        this.anyBanorte(data);
      }
      
    } catch (error) {
      console.error(error);
      this.catchError('ELIMINAR COLUMNA *TRANS* Y REVISE EL FORMATO DE LA FECHA');
    }
  }

  banregioFormat(data: any[]) {
    try {
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map( (registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;

        let fechaMov = registro[banregioEnum.FECHA];
        
        reg.dia = fechaMov.substring(0,2);
        reg.mes = fechaMov.substring(3,5);
        reg.anio = fechaMov.substring(6,10);
        
        if(numDay != reg.dia) {
          numDay = reg.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        reg.id_interno = counterByDay;

        reg.observacion = registro[banregioEnum.OBS] ? registro[banregioEnum.OBS] : '';
        reg.concepto = registro[banregioEnum.DESC].trim();
        
        let idx = reg.concepto.search('LIQ:');
        reg.hora_movimiento = idx != -1 ? reg.concepto.slice(idx + 5, idx + 13).trim() : '';
        
        reg.entrada = registro[banregioEnum.ABONO] ? this.formatNumber(registro[banregioEnum.ABONO]) : 0.00;
        reg.salida = registro[banregioEnum.CARGO] ? this.formatNumber(registro[banregioEnum.CARGO]) : 0.00;
        reg.saldo = registro[banregioEnum.SALDO] ? this.formatNumber(registro[banregioEnum.SALDO]) : 0.00;
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

    } catch (error) {
      console.error(error);
      this.catchError('ELIMINAR CABECERA');
    }
  }



  private praxiBanorte(data: any) {
    
    let numDay: string | number = 0;
    let counterByDay = 0;

    this.data = data.map( (registro: any) => {
      let reg:generic = this.initReg();

      reg.fecha_reporte = this.dateReport;
      reg.hora_reporte = this.timeReport;

      let fechaMov = registro[praxiEnum.FECHA];
      
      reg.dia = fechaMov.substring(0,2);
      reg.mes = fechaMov.substring(3,5);
      reg.anio = fechaMov.substring(6,10);
      
      if(numDay != reg.dia) {
        numDay = reg.dia;
        counterByDay = 1;
      } else {
        counterByDay += 1;
      }
      reg.id_interno = counterByDay;

      reg.observacion = registro[praxiEnum.OBS].toString().trim();
      reg.concepto = registro[praxiEnum.DESC].trim();
      
      let idx = reg.concepto.search('LIQ:');
      reg.hora_movimiento = idx != -1 ? reg.concepto.slice(idx + 5, idx + 13).trim() : '';
      
      reg.entrada = isNaN(registro[praxiEnum.ABONO]) ? 0.00 : registro[praxiEnum.ABONO];
      reg.salida = isNaN(registro[praxiEnum.CARGO]) ? 0.00 : registro[praxiEnum.CARGO];
      reg.saldo = registro[praxiEnum.SALDO];
      reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
    
      return reg;
    });
  }

  private anyBanorte(data: any) {

    let numDay: string | number = 0;
    let counterByDay = 0;

    this.data = data.map( (registro: any) => {
      let reg:generic = this.initReg();

      reg.fecha_reporte = this.dateReport;
      reg.hora_reporte = this.timeReport;

      let fechaMov = this.formatDate(registro[banorteEnum.FECHA]);
      
      reg.dia = fechaMov.substring(0,2);
      reg.mes = fechaMov.substring(3,5);
      reg.anio = fechaMov.substring(6,10);
      
      if(numDay != reg.dia) {
        numDay = reg.dia;
        counterByDay = 1;
      } else {
        counterByDay += 1;
      }
      reg.id_interno = counterByDay;

      reg.observacion = '';
      reg.concepto = registro[banorteEnum.DESC].trim();
      
      let idx = reg.concepto.search('LIQ:');
      reg.hora_movimiento = idx != -1 ? reg.concepto.slice(idx + 5, idx + 13).trim() : '';
      
      reg.entrada = registro[banorteEnum.ABONO] ? this.formatNumber(registro[banorteEnum.ABONO]) : 0.00;
      if(registro[banorteEnum.CARGO]) {
        let cargo = this.formatNumber(registro[banorteEnum.CARGO]);
        reg.salida = cargo < 0 ? cargo * (-1) : cargo;
      } else {
        reg.salida = 0.00;
      }
      reg.saldo = registro[banorteEnum.SALDO];
      reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
    
      return reg;
    });
  }

  alquimiaFormat(data: any[]) {
    try {
      this.data = data.map( (registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = '';
        reg.dia = registro[alquimiaEnum.FECHA].substring(0,2);
        reg.mes = registro[alquimiaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();

        reg.observacion = registro[alquimiaEnum.OBS];
        reg.concepto = registro[alquimiaEnum.DESC].trim();

        reg.entrada = registro[alquimiaEnum.ABONO] ? this.formatNumber(registro[alquimiaEnum.ABONO]) : 0.00;
        if(registro[alquimiaEnum.CARGO]) {
          let cargo = this.formatNumber(registro[alquimiaEnum.CARGO]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
        } else {
          reg.salida = 0.00;
        }
        reg.saldo = this.formatNumber(registro[alquimiaEnum.SALDO]) || 0.00;
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

      this.data = this.reverseArray(this.data);

    } catch (error) {
      console.error(error);
      this.catchError('QUITAR INFORMACIÓN DE CABECERA');
    }
  }

  aztecaFormat(data: any[]) {
    try {
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map( (registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;

        reg.hora_movimiento = '';
        reg.dia = registro[aztecaEnum.FECHA].substring(8,10);
        reg.mes = registro[aztecaEnum.FECHA].substring(5,7);
        reg.anio = this.appService.formData.date.getFullYear();

        if(numDay != reg.dia) {
          numDay = reg.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        reg.id_interno = counterByDay;

        reg.observacion = registro[aztecaEnum.OBS].trim();
        reg.concepto = registro[aztecaEnum.DESC].trim();

        if(registro[aztecaEnum.IMPORTE] > 0) {
          reg.entrada = registro[aztecaEnum.IMPORTE];
          reg.salida = 0.00;
        } else {
          let cargo = this.formatNumber(registro[aztecaEnum.IMPORTE]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
          reg.entrada = 0.00;
        }
        reg.saldo = registro[aztecaEnum.SALDO] || 0.00;
        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });
    } catch (error) {
      console.error(error);
      this.catchError('ERROR');
    }
  }

  hsbcFormat(data: any[]) {
    try {
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map( (registro) => {
        let reg:generic = this.initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = '';
        reg.dia = registro[hsbcEnum.FECHA].substring(0,2);
        reg.mes = registro[hsbcEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        
        if(numDay != reg.dia) {
          numDay = reg.dia;
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        reg.id_interno = counterByDay;

        reg.observacion = `${registro[hsbcEnum.OBS]} ${registro[hsbcEnum.OBS2]}`.trim();
        reg.concepto = registro[hsbcEnum.DESC].trim();

        reg.entrada = registro[hsbcEnum.ABONO] ? this.formatNumber(registro[hsbcEnum.ABONO]) : 0.00;
        if(registro[hsbcEnum.CARGO]) {
          let cargo = this.formatNumber(registro[hsbcEnum.CARGO]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
        } else {
          reg.salida = 0.00;
        }
        reg.saldo = registro[hsbcEnum.SALDO];

        reg.tipo = this.defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

    } catch (error) {
      console.error(error);
      this.catchError('ERROR');
    }
  }

  /** 
   * FUNCIONES DE UTILIDAD 
   * 
   * */

  private initReg(): generic {
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

  private compareFiles() {
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

  private catchError(msg: string = '') {
    if(msg.length) {
      this.messages.push({severity:'error', summary: msg});
      this.showMessage = true;
    }
    this.data = []; 
  }

  private defineType(texto: string, entrada: number, salida: number): string {
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

  private exportAsExcelFile(json: any[], excelFileName: string): void {
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

  private formatNumber(quantity: any): number {
    if (isNaN(quantity)) {
      let quant: string = quantity.replace('(','');
      quant = quant.replace(')','');
      quant = quant.replace('$','');
      quant = quant.replace(' ','');
      // quant = quant.split(',').join('');
      let comma = quant.indexOf(',');
      let dot = quant.indexOf('.');
      
      if(comma > dot) {
        quant = quant.split('.').join('');
        quant = quant.replace(',','.');
      } else {
        if(comma > 0) {
          quant = quant.split(',').join('');
        }
      }
      return parseFloat(quant);
    } else {
      return quantity;
    }
  }

  private format2DigitNumber(num: number): string {
    return num < 10 ? '0'.concat(num.toString()) : num.toString();
  }

  private reverseArray(data: any[]): any[] {
    let numDay: string | number = 0;
    let counterByDay = 0;

    data = data.reverse();

    data = data.map((registro: generic) => {
      if(numDay != registro.dia) {
        numDay = registro.dia;
        counterByDay = 1;
      } else {
        counterByDay += 1;
      }
      registro.id_interno = counterByDay;
      return registro;
    });
    return data;
  }

  private formatDate(date: string) {
    const idx = date.includes('.');
    if(idx) {
      date = date.replace('.','');
    }
    let day = date.split('/')[0];
    let monthText = date.split('/')[1];
    let month = this.formatMonth(monthText);
    let year = date.split('/')[2];
      
    return `${day}-${month}-${year}`;
  }

  private formatMonth(monthText: string): string {
    let month = '00';
    if(monthText.toLowerCase().includes('ene'))
    {
      month = '01';
    }
    else if(monthText.toLowerCase().includes('feb'))
    {
      month = '02';
    }
    else if(monthText.toLowerCase().includes('mar'))
    {
      month = '03';
    }
    else if(monthText.toLowerCase().includes('abr'))
    {
      month = '04';
    }
    else if(monthText.toLowerCase().includes('may'))
    {
      month = '05';
    }
    else if(monthText.toLowerCase().includes('jun'))
    {
      month = '06';
    }
    else if(monthText.toLowerCase().includes('jul'))
    {
      month = '07';
    }
    else if(monthText.toLowerCase().includes('ago'))
    {
      month = '08';
    }
    else if(monthText.toLowerCase().includes('sep'))
    {
      month = '09';
    }
    else if(monthText.toLowerCase().includes('oct'))
    {
      month = '10';
    }
    else if(monthText.toLowerCase().includes('nov'))
    {
      month = '11';
    }
    else if(monthText.toLowerCase().includes('dic'))
    {
      month = '12';
    }
    return month;
  }

}
