import * as FileSaver from "file-saver";
import * as XLSX from 'xlsx';
import { generic } from "../app.interfaces";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


/** 
 * FUNCIONES DE UTILIDAD 
 * 
 * */

export function initReg(): generic {
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


export function defineType(texto: string, entrada: number, salida: number): string {
    let tipo = '';

    if (entrada > 0 && salida > 0) {
        tipo = 'cancelado';
    } else if ((texto.toLowerCase().includes('pago cheque') ||
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

export function saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
}


export function exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
        Sheets: { 'Hoja1': worksheet },
        SheetNames: ['Hoja1']
    };
    const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx', type: 'array'
    });
    saveAsExcelFile(excelBuffer, excelFileName);
}

export function getCaseInsensitiveProperty(obj: any, key: string): any {
    if (!obj || !key) return undefined;

    // First try exact match
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }

    // Then try case-insensitive match
    const keys = Object.keys(obj);
    const foundKey = keys.find(k => k.toLowerCase() === key.toLowerCase());
    return foundKey ? obj[foundKey] : undefined;
}


export function formatNumber(quantity: any): number {
    if (isNaN(quantity)) {
        let quant: string = quantity.replace('(', '');
        quant = quant.replace(')', '');
        quant = quant.replace('$', '');
        quant = quant.replace(' ', '');
        // quant = quant.split(',').join('');
        let comma = quant.indexOf(',');
        let dot = quant.indexOf('.');

        if (comma > dot) {
            quant = quant.split('.').join('');
            quant = quant.replace(',', '.');
        } else {
            if (comma > 0) {
                quant = quant.split(',').join('');
            }
        }
        return parseFloat(quant);
    } else {
        return quantity;
    }
}

export function format2DigitNumber(num: number): string {
    return num < 10 ? '0'.concat(num.toString()) : num.toString();
}

export function reverseArray(data: any[]): any[] {
    let numDay: string | number = 0;
    let counterByDay = 0;

    data = data.reverse();

    data = data.map((registro: generic) => {
        if (numDay != registro.dia) {
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

export function formatDate(date: string) {
    const idx = date.includes('.');
    if (idx) {
        date = date.replace('.', '');
    }
    let day = date.split('/')[0];
    let monthText = date.split('/')[1];
    let month = formatMonth(monthText);
    let year = date.split('/')[2];

    return `${day}-${month}-${year}`;
}

export function formatMonth(monthText: string): string {
    let month = '00';
    if (monthText.toLowerCase().includes('ene')) {
        month = '01';
    }
    else if (monthText.toLowerCase().includes('feb')) {
        month = '02';
    }
    else if (monthText.toLowerCase().includes('mar')) {
        month = '03';
    }
    else if (monthText.toLowerCase().includes('abr')) {
        month = '04';
    }
    else if (monthText.toLowerCase().includes('may')) {
        month = '05';
    }
    else if (monthText.toLowerCase().includes('jun')) {
        month = '06';
    }
    else if (monthText.toLowerCase().includes('jul')) {
        month = '07';
    }
    else if (monthText.toLowerCase().includes('ago')) {
        month = '08';
    }
    else if (monthText.toLowerCase().includes('sep')) {
        month = '09';
    }
    else if (monthText.toLowerCase().includes('oct')) {
        month = '10';
    }
    else if (monthText.toLowerCase().includes('nov')) {
        month = '11';
    }
    else if (monthText.toLowerCase().includes('dic')) {
        month = '12';
    }
    return month;
}