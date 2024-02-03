import React from 'react';
import ExcelJS from 'exceljs';

const DataExporter = ({ data }) => {
    const exportToCSV = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // TODO: Add data to worksheet

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.xlsx';
            a.click();
        });
    };
};

export default DataExporter;
