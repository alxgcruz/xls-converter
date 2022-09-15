export interface Bank {
  bank: string;
  account: string;
}
export interface Accounting {
  bank: string;
  account: string;
}
export class Accounting {
  bank: string;
  account: string;
  constructor(bank: string, account: string) {
    this.bank = bank;
    this.account = account;
  }
}

export interface Business {
  name: string;
  accounts: Accounting[];
}

export class Business {
  name: string;
  accounts: Accounting[];
  constructor(name: string, accounting: Accounting[]) {
    this.name = name;
    this.accounts = accounting;
  }
}


export const BANKS = [
  {name: 'STP'},
  {name: 'BBVA'},
  {name: 'SANTANDER'},
  {name: 'BANBAJIO'},
  {name: 'MIFEL'},
  {name: 'BANORTE'},
  {name: 'MULTIVA'},
  {name: 'AFIRME'},
  {name: 'BXMAS'},
  {name: 'BANREGIO'},
  {name: 'ASP INTEGRA'},
  {name: 'SANTANDER DLS'},
  {name: 'BBVA DLS'},
  {name: 'AFIRME DLS'},
]

export const BUSINESS = [
  {
    name: 'RCA',
    accounts : [
      {bank: 'AFIRME', account: '16291012454'},
      {bank: 'BBVA', account: '0110690287'},
      {bank: 'STP', account: '646180251113600006'},
    ]
  },
  {
    name: 'DAS',
    accounts : [
      {bank: 'BBVA', account: '0110690503'},
      {bank: 'AFIRME', account: '016291012446'},
    ]
  },
  {
    name: 'POLMEL',
    accounts : [
      {bank: 'BANORTE', account: '0487511110'},
      {bank: 'MULTIVA', account: '00005573645'},
      {bank: 'SANTANDER', account: '92001685428'},
    ]
  },
  {
    name: 'PEQ',
    accounts : [
      {bank: 'MIFEL', account: '1600261513'},
      {bank: 'SANTANDER', account: '65506391543'},
      {bank: 'STP', account: '646180251102600004'},
    ]
  },
  {
    name: 'ANCLAJE',
    accounts : [
      {bank: 'STP', account: '646180251115000002'},
    ]
  },
  {
    name: 'PRAXI',
    accounts : [
      {bank: 'BANORTE', account: '0298221062'},
      {bank: 'SANTANDER', account: '65508624023'},
    ]
  },
  {
    name: 'URANDEN',
    accounts : [
      {bank: 'BXMAS', account: '388602'},
      {bank: 'STP', account: '646180251106900001'},
    ]
  },
  {
    name: '112029',
    accounts : [
      {bank: 'SANTANDER', account: '65505582398'},
      {bank: 'SANTANDER DLS', account: '82500795740'},
    ]
  },
  {
    name: 'AXA',
    accounts : [
      {bank: 'BANBAJIO', account: '34811828'},
      {bank: 'STP', account: '646180251113800000'},
    ]
  },
  {
    name: 'FJ',
    accounts : [
      {bank: 'AFIRME', account: '16291012160'},
      {bank: 'STP', account: '646180251130800009'},
      {bank: 'STP', account: '6461802511190000008'},
    ]
  },
  {
    name: 'DAF',
    accounts : [
      {bank: 'BBVA', account: '117761597'},
      {bank: 'SANTANDER', account: '65506905859'},
      {bank: 'STP', account: '646180251113700003'},
    ]
  },
  {
    name: 'MEXQRO',
    accounts : [
      {bank: 'BBVA', account: '0115956579'},
      {bank: 'STP', account: '646180251102800008'},
    ]
  },
  {
    name: 'PETRA',
    accounts : [
      {bank: 'BBVA', account: '0116585922'},
      {bank: 'STP', account: '646180251105600001'},
    ]
  },
  {
    name: 'HERCULES',
    accounts : [
      {bank: 'BANBAJIO', account: '36939304'},
      {bank: 'BBVA', account: '01168447366'},
      {bank: 'STP', account: '646180251105700008'},
    ]
  },
  {
    name: 'MAOR',
    accounts : [
      {bank: 'SANTANDER', account: '65507266113'},
      {bank: 'STP', account: '646180251104200004'},
    ]
  },
  {
    name: 'DFL',
    accounts : [
      {bank: 'BBVA', account: '0117062842'},
      {bank: 'BBVA DLS', account: '0117063318'},
      {bank: 'STP', account: '646180251114400001'},
    ]
  },
  {
    name: 'ZAS',
    accounts : [
      {bank: 'MIFEL', account: '1600261505'},
      {bank: 'SANTANDER', account: '65506393345'},
      {bank: 'STP', account: '646180251119200002'},
    ]
  },
  {
    name: 'TABASCO',
    accounts : [
      {bank: 'BANBAJIO', account: '292078910201'},
      {bank: 'BANORTE', account: '1119613358'},
      {bank: 'STP', account: '646180251102900005'},
    ]
  },
  {
    name: 'ARLE',
    accounts : [
      {bank: 'BANBAJIO', account: '348452970201'},
      {bank: 'MIFEL', account: '01600559075'},
      {bank: 'STP', account: '646180251113900007'},
    ]
  },
  {
    name: 'AF',
    accounts : [
      {bank: 'SANTANDER', account: '65508643401'},
      {bank: 'STP', account: '646180251113500009'},
    ]
  },
  {
    name: 'CYMMEX',
    accounts : [
      {bank: 'SANTANDER', account: '65506758241'},
      {bank: 'STP', account: '646180251114000003'},
    ]
  },
  {
    name: 'SEGRE',
    accounts : [
      {bank: 'BANREGIO', account: '1165920680011'},
      {bank: 'STP', account: '646180251115200006'},
    ]
  },
  {
    name: 'SIMMA',
    accounts : [
      {bank: 'AFIRME', account: '16291012284'},
      {bank: 'AFIRME DLS', account: '16291008368'},
      {bank: 'STP', account: '646180251135500003'},
      {bank: 'STP', account: '646180251102700001'},
    ]
  },
  {
    name: 'TIERRA LEVITA',
    accounts : [
      {bank: 'SANTANDER', account: '65508090249'},
      {bank: 'BBVA', account: '0118819661'},
    ]
  },
  {
    name: 'HEX',
    accounts : [
      {bank: 'SANTANDER', account: '014680655080902497'},
    ]
  },
  {
    name: 'PBB',
    accounts : [
      {bank: 'AFIRME', account: '16291011199'},
      {bank: 'ASP INTEGRA', account: '659803000000277753'},
      {bank: 'STP', account: '646180251127000003'},
    ]
  },
  {
    name: 'ESL',
    accounts : [
      {bank: 'BBVA', account: '0117566190'},
      {bank: 'BBVA DLS', account: '01175662638'},
      {bank: 'SANTANDER', account: '92001094274'},
      {bank: 'STP', account: '646180251114900006'},
    ]
  },
  {
    name: 'KIOSUKO',
    accounts : [
      {bank: 'ASP INTEGRA', account: '659803000000277782'},
    ]
  },
  {
    name: 'CAMPO',
    accounts : [
      {bank: 'BBVA', account: '0118619298'},
    ]
  }
]

export interface generic {
  entrada: number;
  salida: number;
  fecha_reporte: string;
  hora_reporte: string;
  observacion: string;
  concepto: string;
  tipo: string;
  dia: string;
  mes: string;
  anio: number | string;
  hora_movimiento: string;
  saldo: number;
  id_interno: number;
}