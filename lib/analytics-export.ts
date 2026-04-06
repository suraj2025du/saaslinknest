/**
 * Convert analytics data to CSV format for export
 */

interface AnalyticsRow {
  timestamp: string;
  eventType: string;
  device: string;
  country: string;
  referrer: string;
  linkTitle?: string;
  linkUrl?: string;
}

export function analyticsToCSV(rows: AnalyticsRow[]): string {
  const headers = ['Timestamp', 'Event Type', 'Device', 'Country', 'Referrer', 'Link Title', 'Link URL'];
  
  const csvRows = rows.map(row => [
    row.timestamp,
    row.eventType,
    row.device || 'unknown',
    row.country || 'unknown',
    row.referrer || 'direct',
    row.linkTitle || '',
    row.linkUrl || '',
  ]);

  const escapeCSV = (value: string | number) => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csv = [
    headers.join(','),
    ...csvRows.map(row => row.map(escapeCSV).join(',')),
  ].join('\n');

  return csv;
}

export function createCSVResponse(csv: string, filename: string): { body: string; headers: Record<string, string> } {
  return {
    body: csv,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  };
}
