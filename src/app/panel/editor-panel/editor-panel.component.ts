import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AppService } from 'src/app/services/app.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-editor-panel',
  templateUrl: './editor-panel.component.html',
  styleUrls: ['./editor-panel.component.scss']
})
export class EditorPanelComponent implements OnInit {

  data: any;
  header: any;
  messages: any[] = [];
  showMessage = false;

  constructor(public appService: AppService) {
    this.data = [];
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

    this.appService.onClickEvent.subscribe(() => {
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
    });
      
    this.appService.dataSource$.subscribe((data: any) => {
      // console.log(this.appService.formData);
      this.messages = [];
      switch (this.appService.formData.bank.bank) {
        case 'SANTANDER':
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
        case 'AFIRME':
            this.afirmeFormat(data);
          break;
        default:
          break;
      }
      
      // this.data = data;
      // console.log('editor-component',{header: this.header, data} );
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
        
        registro[genEnum.FECHA_REPORTE] = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
        registro[genEnum.HORA_REPORTE] = this.appService.formData.time.toTimeString().substring(0,8);
        // registro[genEnum.HORA_REPORTE] = this.formatAMPM(this.appService.formData.time);
        
        registro[genEnum.DIA] = parseInt(registro['Fecha'].substring(1,3));
        registro[genEnum.MES] = parseInt(registro['Fecha'].substring(3,5));
        registro[genEnum.ANIO] = parseInt(registro['Fecha'].substring(5,9));
        registro[genEnum.HORA_MOVIMIENTO] = registro['Hora'];

        if(numDay != registro[genEnum.DIA]) {
          numDay = registro[genEnum.DIA];
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro[genEnum.ID_INTERNO] = counterByDay;

        if(registro['Cargo/Abono'] === '+') {
          registro[genEnum.ABONO] = parseFloat(registro['Importe']);
          registro[genEnum.CARGO] = 0.00;
        } else {
          registro[genEnum.ABONO] = 0.00;
          registro[genEnum.CARGO] = parseFloat(registro['Importe']);
        }
        registro[genEnum.SALDO] = registro['Saldo'];
        registro['Descripción'] = registro['Descripción'].toString().trim();
        registro['Referencia'] = registro['Referencia'].toString().trim();
        registro[genEnum.CONCEPTO] = registro[genEnum.CONCEPTO].toString().trim();
        
        if(!registro[genEnum.CONCEPTO].length) {
          registro[genEnum.OBSERVACION] = registro['Descripción'] + " " + registro['Referencia'];
          registro[genEnum.TIPO] = this.defineType(registro[genEnum.OBSERVACION], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        } else {
          registro[genEnum.OBSERVACION] = '';
          registro[genEnum.TIPO] = this.defineType(registro[genEnum.CONCEPTO], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        }
  
        delete registro['Cuenta'];
        delete registro['Sucursal'];
        delete registro['Clave de Rastreo'];
        delete registro['Causa Devolución'];
        delete registro['Clabe Beneficiario'];
        delete registro['Código Devolución'];
        delete registro['Causa Devolución'];
        delete registro['Cta Ordenante'];
        delete registro['Nombre Beneficiario'];
        delete registro['Nombre Ordenante'];
        delete registro['Banco Participante'];
        delete registro['RFC Ordenante'];
        delete registro['RFC Beneficiario'];
        delete registro['Fecha'];
        delete registro['Hora'];
        delete registro['Importe'];
        delete registro['Cargo/Abono'];
        delete registro['Descripción'];
        delete registro['Referencia'];
  
        let sortedObject: any = {};
        this.header.forEach((head: string) => {
          sortedObject[head] = registro[head];
        });
  
        return sortedObject;
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
        registro[genEnum.FECHA_REPORTE] = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
        registro[genEnum.HORA_REPORTE] = this.appService.formData.time.toTimeString().substring(0,8);
        // registro[genEnum.HORA_REPORTE] = this.formatAMPM(this.appService.formData.time);
        
        registro[genEnum.DIA] = dayjs(registro[multivaEnum.FECHA]).get('day');
        registro[genEnum.MES] = this.appService.formData.date.getMonth() + 1;
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();
        registro[genEnum.HORA_MOVIMIENTO] = registro['Fecha de Aplicacion'];
        
        registro[genEnum.OBSERVACION] = '';
        registro[genEnum.CONCEPTO] = registro[multivaEnum.DESC].toString().trim();
        registro[genEnum.ABONO] = registro[genEnum.ABONO] ? registro[genEnum.ABONO] : 0.00;
        registro[genEnum.CARGO] = registro[genEnum.CARGO] ? registro[genEnum.CARGO] * -1 : 0.00;
        registro[genEnum.SALDO] = registro['Saldo'];
        registro[genEnum.TIPO] = this.defineType(registro[genEnum.CONCEPTO], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        
        delete registro['Folio'];
        delete registro['Referencia'];
        delete registro['Fecha de Aplicacion'];
        delete registro[multivaEnum.FECHA];
        delete registro[multivaEnum.DESC];
        
        let sortedObject: any = {};
        this.header.forEach((head: string) => {
          sortedObject[head] = registro[head];
        });
  
        return sortedObject;
  
      });

      this.data = this.data.reverse();

      this.data = this.data.map( (registro: any) => {
        if(numDay != registro[genEnum.DIA]) {
          numDay = registro[genEnum.DIA];
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro[genEnum.ID_INTERNO] = counterByDay;
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
        if ( isNaN(registro[genEnum.ABONO]) && isNaN(registro[genEnum.CARGO]) ) {
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

        registro[genEnum.FECHA_REPORTE] = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
        registro[genEnum.HORA_REPORTE] = this.appService.formData.time.toTimeString().substring(0,8);
        // registro[genEnum.HORA_REPORTE] = this.formatAMPM(this.appService.formData.time);
        
        registro[genEnum.DIA] = dayjs(registro[mifelEnum.FECHA]).get('day');
        registro[genEnum.MES] = this.appService.formData.date.getMonth() + 1;
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();
        registro[genEnum.HORA_MOVIMIENTO] = '';
        
        if(numDay != registro[genEnum.DIA]) {
          numDay = registro[genEnum.DIA];
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro[genEnum.ID_INTERNO] = counterByDay;

        registro[genEnum.OBSERVACION] = '';
        registro[genEnum.CONCEPTO] = registro[mifelEnum.DESC].trim();
        registro[genEnum.ABONO] ? registro[genEnum.ABONO] : 0.00;
        registro[genEnum.CARGO] ? registro[genEnum.CARGO] : 0.00;
        registro[genEnum.SALDO] = registro[mifelEnum.SALDO];
        registro[genEnum.TIPO] = this.defineType(registro[genEnum.CONCEPTO], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        

        delete registro[mifelEnum.DESC];
        delete registro[mifelEnum.NO];
        delete registro[mifelEnum.FECHA];
        delete registro['Moneda'];
        delete registro['Folio de Operaciï¿½n'];
        delete registro['No. de Cheque'];
        delete registro['Referencia'];

        let sortedObject: any = {};
        this.header.forEach((head: string) => {
          sortedObject[head] = registro[head];
        });

        return sortedObject;
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
          registro[genEnum.DIA] = parseInt(diaReg);
          registro[genEnum.MES] = parseInt(mesReg);
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
              if(newData[idx][genEnum.ABONO] === '- ') {
                newData[idx][genEnum.ABONO] = 0.00;
              }
              newData[idx][stpEnum.ABONO] += quaPart;
            }
          }
        }
      }


      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = newData.map( registro => {
        
        if(numDay != registro[genEnum.DIA]) {
          numDay = registro[genEnum.DIA];
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro[genEnum.ID_INTERNO] = counterByDay;

        registro[genEnum.FECHA_REPORTE] = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
        registro[genEnum.HORA_REPORTE] = this.appService.formData.time.toTimeString().substring(0,8);
        // registro[genEnum.HORA_REPORTE] = this.formatAMPM(this.appService.formData.time);
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();
        registro[genEnum.HORA_MOVIMIENTO] = registro[stpEnum.HORA];
        
        registro[genEnum.OBSERVACION] = '';
        registro[genEnum.CONCEPTO] = registro[stpEnum.MOV].trim();

        if(registro[genEnum.ABONO] === '- ') {
          registro[genEnum.ABONO] = 0.00;
        } else {
          registro[genEnum.ABONO] = isNaN(registro[genEnum.ABONO]) ? this.formatNumber(registro[genEnum.ABONO]) : registro[genEnum.ABONO];
        }
        if(registro[genEnum.CARGO] === '- ') {
          registro[genEnum.CARGO] = 0.00;
        } else {
          registro[genEnum.CARGO] = isNaN(registro[genEnum.CARGO]) ? this.formatNumber(registro[genEnum.CARGO]) : registro[genEnum.CARGO];
        }
        registro[genEnum.SALDO] = isNaN(registro[genEnum.SALDO]) ? this.formatNumber(registro[genEnum.SALDO]) : registro[genEnum.SALDO];
        registro[genEnum.TIPO] = this.defineType(registro[genEnum.CONCEPTO], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        
        
        delete registro[stpEnum.HORA];
        delete registro[stpEnum.MOV];

        let sortedObject: any = {};
        this.header.forEach((head: string) => {
          sortedObject[head] = registro[head];
        });

        return sortedObject;
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
        // console.log(Object.assign({},registro));
        registro[genEnum.FECHA_REPORTE] = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
        registro[genEnum.HORA_REPORTE] = this.appService.formData.time.toTimeString().substring(0,8);
        // registro[genEnum.HORA_REPORTE] = this.formatAMPM(this.appService.formData.time);
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();
        registro[genEnum.HORA_MOVIMIENTO] = registro[bajioEnum.HORA];

        registro[genEnum.DIA] = dayjs(registro[bajioEnum.FECHA_MOVIMIENTO]).get('day') + 1;
        registro[genEnum.MES] = dayjs(registro[bajioEnum.FECHA_MOVIMIENTO]).get('month') + 1;
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();
        
        registro[genEnum.OBSERVACION] = '';
        registro[genEnum.CONCEPTO] = registro[bajioEnum.DESC].trim();

        registro[genEnum.ABONO] = registro[bajioEnum.ABONOS];
        registro[genEnum.CARGO] = registro[bajioEnum.CARGOS];
        registro[genEnum.SALDO] = registro[bajioEnum.SALDO];
        registro[genEnum.TIPO] = this.defineType(registro[genEnum.CONCEPTO], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        
        
        delete registro[bajioEnum.HORA];
        delete registro[bajioEnum.DESC];
        delete registro[bajioEnum.ABONOS];
        delete registro[bajioEnum.CARGOS];
        delete registro[bajioEnum.FECHA_MOVIMIENTO];
        delete registro[bajioEnum.NUM];
        delete registro[bajioEnum.RECIBO];

        let sortedObject: any = {};
        this.header.forEach((head: string) => {
          sortedObject[head] = registro[head];
        });

        return sortedObject;
      });

      this.data = this.data.reverse();

      this.data = this.data.map((registro: any) => {
        if(numDay != registro[genEnum.DIA]) {
          numDay = registro[genEnum.DIA];
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro[genEnum.ID_INTERNO] = counterByDay;
        return registro;
      });

    } catch(err) {
      console.error(err);
      this.catchError('ELIMINAR LA INFORMACIÓN SUPERIOR PARA DEJAR SOLO LA TABLA');
    }
  }

  bbvaFormat(data: any[]) {
    try {
      let numDay: string | number = 0;
      let counterByDay = 0;

      this.data = data.map( registro => {
        // console.log(Object.assign({},registro));

        registro[genEnum.FECHA_REPORTE] = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
        registro[genEnum.HORA_REPORTE] = this.appService.formData.time.toTimeString().substring(0,8);
        // registro[genEnum.HORA_REPORTE] = this.formatAMPM(this.appService.formData.time);
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();
        registro[genEnum.HORA_MOVIMIENTO] = '';

        registro[genEnum.DIA] = parseInt(registro[bbvaEnum.FECHA].substring(0,2));
        registro[genEnum.MES] = parseInt(registro[bbvaEnum.FECHA].substring(3,5));
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();
        
        registro[genEnum.OBSERVACION] = '';
        registro[genEnum.CONCEPTO] = registro[bbvaEnum.DESC].trim();

        registro[genEnum.ABONO] = registro[bbvaEnum.ABONO] ? registro[bbvaEnum.ABONO] : 0.00;
        registro[genEnum.CARGO] = registro[bbvaEnum.CARGO] ? registro[bbvaEnum.CARGO] : 0.00;
        registro[genEnum.SALDO] = registro[bbvaEnum.SALDO];
        registro[genEnum.TIPO] = this.defineType(registro[genEnum.CONCEPTO], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        
        
        delete registro[bbvaEnum.FECHA];
        delete registro[bbvaEnum.DESC];

        let sortedObject: any = {};
        this.header.forEach((head: string) => {
          sortedObject[head] = registro[head];
        });

        return sortedObject;
      });

      this.data = this.data.reverse();

      this.data = this.data.map((registro: any) => {
        if(numDay != registro[genEnum.DIA]) {
          numDay = registro[genEnum.DIA];
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro[genEnum.ID_INTERNO] = counterByDay;
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
        console.log(Object.assign({}, registro));

        registro[genEnum.FECHA_REPORTE] = this.appService.formData.date.toLocaleDateString('short',{day: '2-digit',month: '2-digit',year: 'numeric'});
        registro[genEnum.HORA_REPORTE] = this.appService.formData.time.toTimeString().substring(0,8);
        // registro[genEnum.HORA_REPORTE] = this.formatAMPM(this.appService.formData.time);
        
        registro[genEnum.DIA] = parseInt(registro[afirmeEnum.FECHA].substring(0,2));
        registro[genEnum.MES] = parseInt(registro[afirmeEnum.FECHA].substring(3,5));
        registro[genEnum.ANIO] = this.appService.formData.date.getFullYear();

        registro[genEnum.HORA_MOVIMIENTO] = ''; /** SACAR DEL CONCEPTO LA HORA */
        
        if(numDay != registro[genEnum.DIA]) {
          numDay = registro[genEnum.DIA];
          counterByDay = 1;
        } else {
          counterByDay += 1;
        }
        registro[genEnum.ID_INTERNO] = counterByDay;

        registro[genEnum.OBSERVACION] = '';
        registro[genEnum.CONCEPTO] = registro[afirmeEnum.DESC].trim();
        registro[genEnum.ABONO] ? registro[afirmeEnum.ABONO] : 0.00;
        registro[genEnum.CARGO] ? registro[afirmeEnum.CARGO] : 0.00;
        registro[genEnum.SALDO] = registro[afirmeEnum.SALDO];
        registro[genEnum.TIPO] = this.defineType(registro[genEnum.CONCEPTO], registro[genEnum.ABONO], registro[genEnum.CARGO]);
        

        delete registro[afirmeEnum.REF];

        let sortedObject: any = {};
        this.header.forEach((head: string) => {
          sortedObject[head] = registro[head];
        });

        return sortedObject;
      });

    } catch (error) {
      console.error(error);
      this.catchError('QUITAR INFORMACIÓN DE CABECERA Y ENTRE PÁGINAS DEL ARCHIVO');
    }
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
    quantity = quantity.replace('$','');
    quantity = quantity.split(',').join('');
    return parseFloat(quantity);
  }

}

enum genEnum {
  ABONO = 'Abono',
  CARGO = 'Cargo',
  FECHA_REPORTE = 'Fecha Reporte',
  HORA_REPORTE = 'Hora Reporte',
  OBSERVACION = 'Observacion',
  CONCEPTO= 'Concepto',
  TIPO = 'Tipo',
  DIA = 'Dia',
  MES = 'Mes',
  ANIO = 'Anio',
  HORA_MOVIMIENTO = 'Hora Movimiento',
  SALDO = 'Saldo',
  ID_INTERNO = 'ID Interno'
}

enum multivaEnum {
  DESC = 'Descripción',
  FECHA = 'Fecha',
}

enum mifelEnum {
  NO = 'No.',
  SALDO = 'Saldo',
  DESC = 'Descripciï¿½n',
  FECHA = 'Fecha',
}

enum stpEnum {
  SALDO = 'Saldo',
  MOV = 'Movimiento',
  ABONO = 'Abono',
  HORA = 'Hora',
}

enum bajioEnum {
  NUM = '#',
  FECHA_MOVIMIENTO = 'Fecha Movimiento',
  HORA = 'Hora',
  RECIBO = 'Recibo',
  DESC = 'Descripción',
  CARGOS = 'Cargos',
  ABONOS = 'Abonos',
  SALDO = 'Saldo'
}

enum bbvaEnum {
  FECHA = 'Fecha',
  DESC = 'Concepto / Referencia',
  CARGO = 'Cargo',
  ABONO = 'Abono',
  SALDO = 'Saldo'
}

enum afirmeEnum {
  FECHA = 'Fecha',
  DESC = 'Concepto',
  REF = 'Referencia',
  CARGO = 'Cargo',
  ABONO = 'Abono',
  SALDO = 'Saldo'
}