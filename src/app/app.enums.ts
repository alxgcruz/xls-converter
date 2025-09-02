
export enum genEnum {
  ABONO = 'entrada',
  CARGO = 'salida',
  FECHA_REPORTE = 'fecha_reporte',
  HORA_REPORTE = 'hora_reporte',
  OBSERVACION = 'observacion',
  CONCEPTO= 'concepto',
  TIPO = 'tipo',
  DIA = 'dia',
  MES = 'mes',
  ANIO = 'anio',
  HORA_MOVIMIENTO = 'hora_movimiento',
  SALDO = 'saldo',
  ID_INTERNO = 'id_interno'
}

export enum santanderEnum {
  FECHA = 'Fecha',
  HORA = 'Hora',
  DIA = 'Dia',
  IMPORTE = 'Importe',
  SALDO = 'Saldo',
  DESC = 'Descripción',
  REF = 'Referencia',
  MOV = 'Cargo/Abono',
  CONCEPTO = 'Concepto',
  CVE = 'Clave de Rastreo',
}

export enum multivaEnum {
  DESC = 'Descripcion',
  FECHA = 'Fecha',
  HORA = 'Fecha de Aplicacion',
  SALDO = 'Saldo',
  ABONO = 'Abono',
  CARGO = 'Cargo',
  REF = 'Referencia',
}

export enum mifelEnum {
  NO = 'No.',
  SALDO = 'Saldo',
  DESC = 'Descripcion',
  FECHA = 'Fecha',
  ABONO = 'Abono',
  CARGO = 'Cargo',
  FOP = 'Folio de Operacion',
}

export enum stpEnum {
  SALDO = 'Saldo',
  TRX = 'Transacción',
  MOV = 'Movimiento',
  ABONO = 'Abono',
  CARGO = 'Cargo',
  HORA = 'Hora',
  DIA = 'Dia',
  MES = 'Mes',
}

export enum bajioEnum {
  NUM = '#',
  FECHA_MOVIMIENTO = 'Fecha Movimiento',
  HORA = 'Hora',
  RECIBO = 'Recibo',
  DESC = 'Descripción',
  CARGOS = 'Cargos',
  ABONOS = 'Abonos',
  SALDO = 'Saldo'
}

export enum bbvaEnum {
  FECHA = 'Fecha',
  DESC = 'Concepto / Referencia',
  CARGO = 'Cargo',
  ABONO = 'Abono',
  SALDO = 'Saldo'
}

export enum afirmeEnum {
  FECHA = 'Fecha',
  DESC = 'Concepto',
  REF = 'Referencia',
  CARGO = 'Cargo',
  ABONO = 'Abono',
  SALDO = 'Saldo'
}

export enum aspEnum {
  FECHA = 'Fecha Operación',
  DESC = 'Concepto',
  ABONO = 'Abono',
  CARGO = 'Monto'
}

export enum banorteEnum {
  FECHA = 'Fecha',
  DESC = 'Concepto',
  ABONO = 'Depositos',
  CARGO = 'Retiros',
  SALDO = 'Saldos'
}

export enum praxiEnum {
  FECHA = 'FECHA DE OPERACIÓN',
  DESC = 'DESCRIPCIÓN DETALLADA',
  ABONO = 'DEPÓSITOS',
  CARGO = 'RETIROS',
  SALDO = 'SALDO',
  OBS = 'DESCRIPCIÓN'
}

export enum banregioEnum {
  FECHA = 'Fecha',
  DESC = 'Descripción',
  OBS = 'Referencia',
  ABONO = 'Abonos',
  CARGO = 'Cargo',
  SALDO = 'Saldo'
}

export enum alquimiaEnum {
  FECHA = 'Fecha',
  DESC = 'Conceptos',
  ABONO = 'Depósito',
  CARGO = 'Retiro',
  OBS = 'Clave de Rastreo',
  SALDO = 'Saldos'
}

export enum aztecaEnum {
  FECHA = 'FECHA DE APLICACION',
  DESC = 'CONCEPTO',
  IMPORTE = 'IMPORTE',
  OBS = 'MOVIMIENTO',
  SALDO = 'SALDO'
}

export enum hsbcEnum {
  FECHA = 'Fecha del apunte',
  DESC = 'Descripción',
  ABONO = 'Importe de crédito',
  CARGO = 'Importe del débito',
  OBS = 'Referencia bancaria',
  OBS2 = 'Referencia de cliente',
  SALDO = 'Saldo'
}