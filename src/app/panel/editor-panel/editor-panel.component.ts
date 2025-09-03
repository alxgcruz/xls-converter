import { Component, OnInit } from '@angular/core';
import { afirmeEnum, alquimiaEnum, aspEnum, aztecaEnum, bajioEnum, banorteEnum, banregioEnum, bbvaEnum, genEnum, hsbcEnum, mifelEnum, multivaEnum, praxiEnum, santanderEnum, stpEnum } from 'src/app/app.enums';
import { AppService } from 'src/app/services/app.service';
import { generic } from '../../app.interfaces';
import { defineType, exportAsExcelFile, format2DigitNumber, formatDate, formatMonth, formatNumber, getCaseInsensitiveProperty, initReg, reverseArray } from '../../utils/utils';

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
        let reg:generic = initReg();

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
        
        reg.tipo = reg.concepto.length ? defineType(reg.concepto, reg.entrada, reg.salida) : defineType(reg.observacion, reg.entrada, reg.salida);

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
        let reg:generic = initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[multivaEnum.FECHA].substring(0,2);
        reg.mes = registro[multivaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        reg.hora_movimiento = registro[multivaEnum.HORA];
        
        reg.observacion = registro[multivaEnum.REF] ? registro[multivaEnum.REF].toString().trim() : '';
        reg.concepto = registro[multivaEnum.DESC].toString().trim();
        reg.entrada = registro[multivaEnum.ABONO] ? formatNumber(registro[multivaEnum.ABONO]) : 0.00;
        reg.salida = registro[multivaEnum.CARGO] ? formatNumber(registro[multivaEnum.CARGO]) * -1 : 0.00;
        reg.saldo = formatNumber(registro[multivaEnum.SALDO]);
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
        
        return reg;
      });

      this.data = reverseArray(this.data);

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
        let reg:generic = initReg();

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
        reg.entrada = registro.hasOwnProperty(mifelEnum.ABONO) ? formatNumber(registro[mifelEnum.ABONO]) : 0.00;
        reg.salida = registro.hasOwnProperty(mifelEnum.CARGO) ? formatNumber(registro[mifelEnum.CARGO]) : 0.00;
        reg.saldo = formatNumber(registro[mifelEnum.SALDO]);
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);

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
              let quaPart = isNaN(registro[stpEnum.ABONO]) ? formatNumber(registro[stpEnum.ABONO]) : registro[stpEnum.ABONO];
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
        let reg:generic = initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = format2DigitNumber(registro[stpEnum.DIA]);
        reg.mes = format2DigitNumber(registro[stpEnum.MES]);
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

        reg.entrada = registro[stpEnum.ABONO] === '- ' ? 0.00 : formatNumber(registro[stpEnum.ABONO]);
        reg.salida = registro[stpEnum.CARGO] === '- ' ? 0.00 : formatNumber(registro[stpEnum.CARGO]);
        reg.saldo = formatNumber(registro[stpEnum.SALDO]);
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);

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
        let reg:generic = initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.dia = registro[bajioEnum.FECHA_MOVIMIENTO].substring(0,2);
        reg.mes = formatMonth(registro[bajioEnum.FECHA_MOVIMIENTO].substring(3,6));
        
        reg.anio = this.appService.formData.date.getFullYear();
        reg.hora_movimiento = registro[bajioEnum.HORA];
        
        reg.observacion = '';
        reg.concepto = registro[bajioEnum.DESC].trim();
        reg.entrada = registro[bajioEnum.ABONOS];
        reg.salida = registro[bajioEnum.CARGOS];
        reg.saldo = registro[bajioEnum.SALDO];
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);

        return reg;
      });

      this.data = reverseArray(this.data);

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
        let reg:generic = initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = '';

        reg.dia = registro[bbvaEnum.FECHA].substring(0,2);
        reg.mes = registro[bbvaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();
        
        reg.observacion = '';
        reg.concepto = registro[bbvaEnum.DESC].trim();

        reg.entrada = getCaseInsensitiveProperty(registro, bbvaEnum.ABONO) ? formatNumber(getCaseInsensitiveProperty(registro, bbvaEnum.ABONO)) : 0.00;
        reg.salida = getCaseInsensitiveProperty(registro, bbvaEnum.CARGO) ? formatNumber(getCaseInsensitiveProperty(registro, bbvaEnum.CARGO)) : 0.00;
        reg.saldo = formatNumber(registro[bbvaEnum.SALDO]);
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);

        return reg;
      });

      this.data = reverseArray(this.data);

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
        let reg:generic = initReg();

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
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
      
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
        let reg:generic = initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = registro[aspEnum.FECHA].substring(11,registro[aspEnum.FECHA].length);
        reg.dia = registro[aspEnum.FECHA].substring(8,10);
        reg.mes = registro[aspEnum.FECHA].substring(5,7);
        reg.anio = this.appService.formData.date.getFullYear();

        reg.observacion = '';
        reg.concepto = registro[aspEnum.DESC].trim();

        reg.entrada = registro[aspEnum.ABONO] ? formatNumber(registro[aspEnum.ABONO]) : 0.00;
        if(registro[aspEnum.CARGO]) {
          let cargo = formatNumber(registro[aspEnum.CARGO]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
        } else {
          reg.salida = 0.00;
        }
        reg.saldo = 0;
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

      this.data = reverseArray(this.data);

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
        let reg:generic = initReg();

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
        
        reg.entrada = registro[banregioEnum.ABONO] ? formatNumber(registro[banregioEnum.ABONO]) : 0.00;
        reg.salida = registro[banregioEnum.CARGO] ? formatNumber(registro[banregioEnum.CARGO]) : 0.00;
        reg.saldo = registro[banregioEnum.SALDO] ? formatNumber(registro[banregioEnum.SALDO]) : 0.00;
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
      
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
      let reg:generic = initReg();

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
      reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
    
      return reg;
    });
  }

  private anyBanorte(data: any) {

    let numDay: string | number = 0;
    let counterByDay = 0;

    this.data = data.map( (registro: any) => {
      let reg:generic = initReg();

      reg.fecha_reporte = this.dateReport;
      reg.hora_reporte = this.timeReport;

      let fechaMov = formatDate(registro[banorteEnum.FECHA]);
      
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
      
      reg.entrada = registro[banorteEnum.ABONO] ? formatNumber(registro[banorteEnum.ABONO]) : 0.00;
      if(registro[banorteEnum.CARGO]) {
        let cargo = formatNumber(registro[banorteEnum.CARGO]);
        reg.salida = cargo < 0 ? cargo * (-1) : cargo;
      } else {
        reg.salida = 0.00;
      }
      reg.saldo = registro[banorteEnum.SALDO];
      reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
    
      return reg;
    });
  }

  alquimiaFormat(data: any[]) {
    try {
      this.data = data.map( (registro) => {
        let reg:generic = initReg();

        reg.fecha_reporte = this.dateReport;
        reg.hora_reporte = this.timeReport;
        
        reg.hora_movimiento = '';
        reg.dia = registro[alquimiaEnum.FECHA].substring(0,2);
        reg.mes = registro[alquimiaEnum.FECHA].substring(3,5);
        reg.anio = this.appService.formData.date.getFullYear();

        reg.observacion = registro[alquimiaEnum.OBS];
        reg.concepto = registro[alquimiaEnum.DESC].trim();

        reg.entrada = registro[alquimiaEnum.ABONO] ? formatNumber(registro[alquimiaEnum.ABONO]) : 0.00;
        if(registro[alquimiaEnum.CARGO]) {
          let cargo = formatNumber(registro[alquimiaEnum.CARGO]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
        } else {
          reg.salida = 0.00;
        }
        reg.saldo = formatNumber(registro[alquimiaEnum.SALDO]) || 0.00;
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

      this.data = reverseArray(this.data);

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
        let reg:generic = initReg();

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
          let cargo = formatNumber(registro[aztecaEnum.IMPORTE]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
          reg.entrada = 0.00;
        }
        reg.saldo = registro[aztecaEnum.SALDO] || 0.00;
        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
      
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
        let reg:generic = initReg();

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

        reg.entrada = registro[hsbcEnum.ABONO] ? formatNumber(registro[hsbcEnum.ABONO]) : 0.00;
        if(registro[hsbcEnum.CARGO]) {
          let cargo = formatNumber(registro[hsbcEnum.CARGO]);
          reg.salida = cargo < 0 ? cargo * (-1) : cargo;
        } else {
          reg.salida = 0.00;
        }
        reg.saldo = registro[hsbcEnum.SALDO];

        reg.tipo = defineType(reg.concepto, reg.entrada, reg.salida);
      
        return reg;
      });

    } catch (error) {
      console.error(error);
      this.catchError('ERROR');
    }
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
      exportAsExcelFile(diffData, name);
    }
  }

  private catchError(msg: string = '') {
    if(msg.length) {
      this.messages.push({severity:'error', summary: msg});
      this.showMessage = true;
    }
    this.data = []; 
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
      exportAsExcelFile(this.data, name);
    }
  }

}
