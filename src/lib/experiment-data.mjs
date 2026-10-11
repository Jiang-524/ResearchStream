import Papa from 'papaparse';

export function parseCsv(text, csv) {
  const headerRow = csv.headerRow === undefined ? 1 : csv.headerRow;
  const dataStartRow = csv.dataStartRow ?? (headerRow === null ? 1 : headerRow + 1);
  if ((headerRow !== null && (!Number.isInteger(headerRow) || headerRow < 1)) || !Number.isInteger(dataStartRow) || dataStartRow < 1 || (headerRow !== null && dataStartRow <= headerRow)) throw new Error('Invalid headerRow / dataStartRow');
  const result = Papa.parse(text.replace(/^\uFEFF/, ''), { delimiter: csv.delimiter ?? ',', header: false, skipEmptyLines: false, dynamicTyping: false });
  if (result.errors.length) throw new Error(`CSV: ${result.errors[0].message}`);
  const records = result.data;
  // A terminal newline does not add a data record; interior empty records retain their position.
  while (records.length && records.at(-1).every(cell => !String(cell).trim())) records.pop();
  const headers = headerRow === null ? null : records[headerRow - 1]?.map(value => String(value).trim());
  if (headerRow !== null && !headers) throw new Error('CSV header row is missing');
  return { headers, rows: records.slice(dataStartRow - 1) };
}

function columnIndex(axis, parsed, allowRow = false) {
  const selectors = [axis.column !== undefined, axis.columnIndex !== undefined, axis.rowNumber === true];
  if (selectors.filter(Boolean).length !== 1 || (axis.rowNumber && !allowRow)) throw new Error('Select exactly one column, columnIndex or x rowNumber');
  if (axis.rowNumber) return -1;
  if (axis.column !== undefined) {
    if (!parsed.headers) throw new Error('Column names require a header row');
    const indices = parsed.headers.flatMap((name, index) => name === axis.column ? [index] : []);
    if (indices.length !== 1) throw new Error(`Column "${axis.column}" is ${indices.length ? 'ambiguous; use columnIndex' : 'missing'}`);
    return indices[0];
  }
  const width = parsed.headers?.length ?? parsed.rows.reduce((max, row) => Math.max(max, row.length), 0);
  if (!Number.isInteger(axis.columnIndex) || axis.columnIndex < 1 || axis.columnIndex > width) throw new Error(`Column index ${axis.columnIndex} is outside the CSV`);
  return axis.columnIndex - 1;
}

function numeric(value) {
  const text = String(value ?? '').trim();
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

export function metricPoints(parsed, csv, metric) {
  const xIndex = columnIndex(csv.x, parsed, true), yIndex = columnIndex(metric, parsed);
  const points = [];
  let skippedX = 0, missingY = 0;
  parsed.rows.forEach((row, index) => {
    const x = xIndex === -1 ? index + 1 : numeric(row[xIndex]);
    if (x === null) { skippedX++; return; }
    const y = numeric(row[yIndex]);
    if (y === null) missingY++;
    points.push([x, y]);
  });
  if (!points.some(point => point[1] !== null)) throw new Error('CSV contains no valid numeric points for this metric');
  points.sort((a,b) => a[0] - b[0]);
  return { points, skippedX, missingY };
}

export function smoothPoints(points, weight) {
  if (!Number.isFinite(weight) || weight < 0 || weight > .99) throw new Error('EMA weight must be between 0 and 0.99');
  let last = null;
  return points.map(([x,y]) => {
    last = y === null ? null : last === null ? y : weight * last + (1-weight) * y;
    return [x,last];
  });
}

export function comparisonGroup(csv, metric) {
  return JSON.stringify([csv.x.quantity,csv.x.unit,metric.quantity,metric.unit]);
}

export function curveKey(project, experiment, csv, metric) {
  return JSON.stringify([project.id,experiment.id,csv.id,metric.id]);
}
