import ExcelJS from 'exceljs';

export const BOOKING_COLUMNS = [
  'Full Name',
  'Email',
  'Phone',
  'Service Type',
  'Preferred Date',
  'Preferred Time',
  'Notes',
  'Status',
];

export const MAX_BOOKING_IMPORT_ROWS = 500;
const SESSION_TIME_OPTIONS = ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'];
const SESSION_TIME_ZONE = 'Africa/Nairobi';

function normalizeHeader(header) {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function cellToString(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim();
  }
  if (value && typeof value === 'object') {
    if ('result' in value) {
      return cellToString(value.result);
    }
    if (Array.isArray(value.richText)) {
      return value.richText.map((part) => cellToString(part.text)).join('').trim();
    }
    if (typeof value.text === 'string') {
      return value.text.trim();
    }
    if (typeof value.hyperlink === 'string') {
      return value.hyperlink.trim();
    }
  }
  return '';
}

function normalizeBookingHeader(header) {
  const normalized = normalizeHeader(header);
  if (['email', 'emailaddress', 'clientemail', 'clientemailaddress'].includes(normalized)) {
    return 'email';
  }
  return normalized;
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

function dateToNairobiSession(dateValue, timeValue) {
  const date = cellToDate(dateValue);
  if (!date) return null;

  let hours;
  let minutes;
  if (typeof timeValue === 'number') {
    const totalMinutes = Math.round(timeValue * 24 * 60);
    hours = Math.floor(totalMinutes / 60) % 24;
    minutes = totalMinutes % 60;
  } else if (timeValue instanceof Date && !Number.isNaN(timeValue.getTime())) {
    hours = timeValue.getUTCHours();
    minutes = timeValue.getUTCMinutes();
  } else if (typeof timeValue === 'string') {
    const match = timeValue.trim().match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i);
    if (!match) return null;
    hours = Number(match[1]) % 12;
    minutes = Number(match[2]);
    if (match[3].toUpperCase() === 'PM') hours += 12;
  } else {
    return null;
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hours - 3, minutes)
  );
}

function formatNairobiDate(value, options) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    ...options,
    timeZone: SESSION_TIME_ZONE,
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatNairobiTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SESSION_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value));
}

export async function createBookingTemplate(serviceNames) {
  const workbook = new ExcelJS.Workbook();
  const bookingsSheet = workbook.addWorksheet('Bookings');
  bookingsSheet.addRow(BOOKING_COLUMNS);
  bookingsSheet.columns = [
    { width: 24 },
    { width: 30 },
    { width: 18 },
    { width: 28 },
    { width: 20 },
    { width: 18 },
    { width: 40 },
    { width: 16 },
  ];

  const optionsSheet = workbook.addWorksheet('Options');
  serviceNames.forEach((serviceName, index) => {
    optionsSheet.getCell(`A${index + 1}`).value = serviceName;
  });
  ['pending', 'confirmed', 'completed', 'cancelled'].forEach((status, index) => {
    optionsSheet.getCell(`B${index + 1}`).value = status;
  });
  SESSION_TIME_OPTIONS.forEach((time, index) => {
    optionsSheet.getCell(`C${index + 1}`).value = time;
  });
  optionsSheet.state = 'veryHidden';
  workbook.definedNames.add(
    `Options!$A$1:$A$${serviceNames.length}`,
    'BookingServiceOptions'
  );
  workbook.definedNames.add('Options!$B$1:$B$4', 'BookingStatusOptions');
  workbook.definedNames.add(
    `Options!$C$1:$C$${SESSION_TIME_OPTIONS.length}`,
    'BookingTimeOptions'
  );

  for (let rowNumber = 2; rowNumber <= MAX_BOOKING_IMPORT_ROWS + 1; rowNumber += 1) {
    const phoneCell = bookingsSheet.getCell(rowNumber, 3);
    phoneCell.numFmt = '@';

    const serviceCell = bookingsSheet.getCell(rowNumber, 4);
    serviceCell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['=BookingServiceOptions'],
      showErrorMessage: true,
      errorTitle: 'Choose a listed service',
      error: 'Select an active service from the dropdown.',
    };

    const dateCell = bookingsSheet.getCell(rowNumber, 5);
    dateCell.numFmt = 'yyyy-mm-dd';
    dateCell.dataValidation = {
      type: 'date',
      operator: 'between',
      allowBlank: true,
      formulae: [new Date(Date.UTC(1900, 0, 1)), new Date(Date.UTC(9999, 11, 31))],
      showErrorMessage: true,
      errorTitle: 'Enter a valid date',
      error: 'Choose a date from the calendar if available, or enter it as YYYY-MM-DD.',
      showInputMessage: true,
      promptTitle: 'Preferred Date',
      prompt: 'Choose a date from the calendar if available, or enter it as YYYY-MM-DD.',
    };

    const timeCell = bookingsSheet.getCell(rowNumber, 6);
    timeCell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['=BookingTimeOptions'],
      showErrorMessage: true,
      errorTitle: 'Choose a listed time',
      error: 'Select one of the available session times.',
    };

    const statusCell = bookingsSheet.getCell(rowNumber, 8);
    statusCell.dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['=BookingStatusOptions'],
      showErrorMessage: true,
      errorTitle: 'Choose a listed status',
      error: 'Select pending, confirmed, completed, or cancelled.',
    };
  }

  const instructions = workbook.addWorksheet('Instructions');
  [
    'JG Impact Booking Import Template',
    'Enter one booking per row on the Bookings sheet. Each row creates a separate booking.',
    'Required columns: Full Name, Phone, Service Type, Preferred Date, Preferred Time.',
    'Optional columns: Email, Notes, Status. Status defaults to pending when blank.',
    'Select Service Type and Status from their dropdowns.',
    'Select Preferred Time from its dropdown.',
    'Session dates and times are interpreted in Africa/Nairobi time.',
    'Preferred Date cells use date validation and YYYY-MM-DD formatting. Use the calendar picker if your spreadsheet app provides one; otherwise enter YYYY-MM-DD.',
    'Phone cells are formatted as text so numbers starting with 0 are preserved.',
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
      booking.preferredDate ? formatNairobiDate(booking.preferredDate) : '',
      booking.preferredDate ? formatNairobiTime(booking.preferredDate) : '',
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
    headerColumns.set(normalizeBookingHeader(cellToString(cell.value)), columnNumber);
  });

  const missingHeaders = [
    ['fullname', 'Full Name'],
    ['phone', 'Phone'],
    ['servicetype', 'Service Type'],
    ['preferreddate', 'Preferred Date'],
    ['preferredtime', 'Preferred Time'],
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
      preferredDate: dateToNairobiSession(
        cellValue('preferreddate'),
        cellValue('preferredtime')
      ),
      notes: cellToString(cellValue('notes')),
      status: cellToString(cellValue('status')),
    };
    const requestedStatus = booking.status.toLowerCase();
    booking.status = requestedStatus === 'canceled' ? 'cancelled' : requestedStatus;
    const errors = [];

    if (!booking.fullName) errors.push('Full Name is required.');
    if (!booking.phone) errors.push('Phone is required.');
    if (!booking.serviceType) errors.push('Service Type is required.');
    if (!booking.preferredDate) {
      errors.push('Preferred Date and Preferred Time must be valid.');
    }
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
