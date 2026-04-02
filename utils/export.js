const fs = require('fs');
const path = require('path');

function exportToCSV(data, filename) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
        csvRows.push(headers.map(header => JSON.stringify(row[header], replacer)).join(','));
    }

    const csvString = csvRows.join('\n');
    fs.writeFileSync(path.join(__dirname, filename), csvString);
}

function replacer(key, value) {
    return value === null ? '' : value;
}

function exportToPDF(data, filename) {
    // Placeholder for PDF export functionality
    // You can use libraries like pdfkit or jsPDF to implement this
}

module.exports = {
    exportToCSV,
    exportToPDF
};