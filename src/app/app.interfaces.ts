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
  {name: 'HSBC'},
  {name: 'ALQUIMIA'},
  {name: 'AZTECA'}
]

export const BUSINESS = [
  {
    name: 'RCA',
    accounts : [
      {bank: 'AFIRME', account: '16291012454'},
      {bank: 'BBVA', account: '0110690287'},
      {bank: 'STP', account: '659803589000000001'},
      {bank: 'HSBC', account: '4069702934'},
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
      {bank: 'STP', account: '659803585000000005'},
      {bank: 'AZTECA', account: '01720119535847'},
    ]
  },
  {
    name: 'PRAXI',
    accounts : [
      {bank: 'AZTECA', account: '127180001517129027'},
      {bank: 'BANORTE', account: '0298221062'},
      {bank: 'SANTANDER', account: '65508624023'},
      {bank: 'STP', account: '659455001000001541'},
      {bank: 'BANBAJIO', account: '440758690201'},
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
      {bank: 'STP', account: '659803588000000002'},
    ]
  },
  {
    name: 'FJ',
    accounts : [
      {bank: 'AFIRME', account: '16291012160'},
      {bank: 'STP', account: '659803683000000004'},
      {bank: 'STP', account: '659803597000000006'},
    ]
  },
  {
    name: 'DAF',
    accounts : [
      {bank: 'BBVA', account: '117761597'},
      {bank: 'SANTANDER', account: '65506905859'},
      {bank: 'STP', account: '659803593000000000'},
    ]
  },
  {
    name: 'MEXQRO',
    accounts : [
      {bank: 'BANBAJIO', account: '030680900038872240'},
      {bank: 'BBVA', account: '0115956579'},
      {bank: 'BBVA', account: '0119420754'},
      {bank: 'STP', account: '659803592000000001'},
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
      {bank: 'AFIRME', account: '062680162910133376'},
      {bank: 'AZTECA', account: '127180001216463547'},
      {bank: 'BANBAJIO', account: '36939304'},
      {bank: 'BBVA', account: '01168447366'},
      {bank: 'STP', account: '659803590000000003'},
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
      {bank: 'STP', account: '659803586000000004'},
      {bank: 'BANORTE', account: '646180251119200002'},
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
      {bank: 'BANBAJIO', account: '030680900037571717'},
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
      {bank: 'STP', account: '659803594000000009'},
    ]
  },
  {
    name: 'SIMMA',
    accounts : [
      {bank: 'AFIRME', account: '16291012284'},
      {bank: 'AFIRME DLS', account: '16291008368'},
      {bank: 'STP', account: '659803596000000007'},
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
      {bank: 'AZTECA', account: '127180001520412624'},
      {bank: 'SANTANDER', account: '014680655080902497'},
      {bank: 'BANBAJIO', account: '030680900039812322'},
      {bank: 'AFIRME', account: '12141000231'},
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
      {bank: 'BANBAJIO', account: '030680900029437898'},
    ]
  },
  {
    name: 'KOSIUKO',
    accounts : [
      {bank: 'ALQUIMIA', account: '659803000000277782'},
      {bank: 'BANBAJIO', account: '412985220201'},      
      {bank: 'STP', account: '659455000000006204'},
    ]
  },
  {
    name: 'CAMPO',
    accounts : [
      {bank: 'AZTECA', account: '127180001519773617'},
      {bank: 'BBVA', account: '0118619298'},
      {bank: 'STP', account: '659455035000000000'},
    ]
  },
  {
    name: 'VALVULAS',
    accounts : [
      {bank: 'BBVA', account: '0120463426'},
      {bank: 'BBVA', account: '0120463175'},
    ]
  },
  {
    name: 'HASSE',
    accounts : [
      {bank: 'STP', account: '659455000000005988'},
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