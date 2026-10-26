import ExcelJS from 'exceljs';

export const BOOKING_COLUMNS = [
  'Full Name',
  'Email',
  'Phone',
  'Service Type',
  'Preferred Date',
  'Notes',
  'Status',
];

export const MAX_BOOKING_IMPORT_ROWS = 500;

function normalizeHeader(header) {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function cellToString(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim();
  }
  return '';
}

function cellToDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(
      Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
    );
  }

  if (typeof value === 'number') {
    const excelEpoch = Date.UTC(1899, 11, 30);
    const date = new Date(excelEpoch + Math.floor(value) * 24 * 60 * 60 * 1000);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value.trim());
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export async function createBookingTemplate() {
  const workbook = new ExcelJS.Workbook();
  const bookingsSheet = workbook.addWorksheet('Bookings');
  bookingsSheet.addRow(BOOKING_COLUMNS);
  bookingsSheet.columns = [
    { width: 24 },
    { width: 30 },
    { width: 18 },
    { width: 28 },
    { width: 20 },
    { width: 40 },
    { width: 16 },
  ];

  const instructions = workbook.addWorksheet('Instructions');
  [
    'JG Impact Booking Import Template',
    'Enter one booking per row on the Bookings sheet. Each row creates a separate booking.',
    'Required columns: Full Name, Phone, Service Type, Preferred Date.',
    'Optional columns: Email, Notes, Status. Status defaults to pending when blank.',
    'Preferred Date format: YYYY-MM-DD.',
    'Allowed statuses: pending, confirmed, completed, cancelled.',
    'Save as an .xlsx workbook before importing.',
  ].forEach((instruction) => instructions.addRow([instruction]));
  instructions.getColumn(1).width = 110;

  return workbook.xlsx.writeBuffer();
}

export async function createBookingExport(bookings) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Bookings');
  worksheet.addRow(BOOKING_COLUMNS);
  bookings.forEach((booking) => {
    worksheet.addRow([
      booking.fullName,
      booking.email ?? '',
      booking.phone,
      booking.serviceType,
      booking.preferredDate
        ? new Date(booking.preferredDate).toISOString().slice(0, 10)
        : '',
      booking.notes ?? '',
      booking.status,
    ]);
  });
  return workbook.xlsx.writeBuffer();
}

export async function parseBookingWorkbook(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('The workbook does not contain a worksheet.');
  }
  if (worksheet.rowCount > MAX_BOOKING_IMPORT_ROWS + 1) {
    throw new Error(`Import no more than ${MAX_BOOKING_IMPORT_ROWS} bookings at a time.`);
  }

  const headerColumns = new Map();
  worksheet.getRow(1).eachCell((cell, columnNumber) => {
    headerColumns.set(normalizeHeader(cellToString(cell.value)), columnNumber);
  });

  const missingHeaders = [
    ['fullname', 'Full Name'],
    ['phone', 'Phone'],
    ['servicetype', 'Service Type'],
    ['preferreddate', 'Preferred Date'],
  ]
    .filter(([key]) => !headerColumns.has(key))
    .map(([, label]) => label);
  if (missingHeaders.length > 0) {
    return {
      bookings: [],
      invalidRows: [
        {
          row: 1,
          errors: [`Missing required column headers: ${missingHeaders.join(', ')}.`],
        },
      ],
    };
  }

  const bookings = [];
  const invalidRows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const values = Array.from({ length: worksheet.columnCount }, (_, index) =>
      row.getCell(index + 1).value
    );
    if (!values.some((value) => cellToString(value) !== '' || value instanceof Date)) return;

    const cellValue = (header) => {
      const columnNumber = headerColumns.get(header);
      return columnNumber ? row.getCell(columnNumber).value : '';
    };
    const booking = {
      fullName: cellToString(cellValue('fullname')),
      email: cellToString(cellValue('email')),
      phone: cellToString(cellValue('phone')),
      serviceType: cellToString(cellValue('servicetype')),
      preferredDate: cellToDate(cellValue('preferreddate')),
      notes: cellToString(cellValue('notes')),
      status: cellToString(cellValue('status')),
    };
    const requestedStatus = booking.status.toLowerCase();
    booking.status = requestedStatus === 'canceled' ? 'cancelled' : requestedStatus;
    const errors = [];

    if (!booking.fullName) errors.push('Full Name is required.');
    if (!booking.phone) errors.push('Phone is required.');
    if (!booking.serviceType) errors.push('Service Type is required.');
    if (!booking.preferredDate) errors.push('Preferred Date must be a valid date.');
    if (booking.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
      errors.push('Email must be a valid email address.');
    }
    if (
      booking.status &&
      !['pending', 'confirmed', 'completed', 'cancelled'].includes(booking.status)
    ) {
      errors.push('Status must be pending, confirmed, completed, or cancelled.');
    }
    if (errors.length > 0) {
      invalidRows.push({ row: rowNumber, errors });
      return;
    }

    bookings.push({
      ...booking,
      status: booking.status || 'pending',
    });
  });

  if (bookings.length + invalidRows.length === 0) {
    throw new Error('No booking rows were found in the first worksheet.');
  }

  return { bookings, invalidRows };
}
