import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define data portion of table for PDF
const getSubPDFData = (submissions) => {
    const rowData = [];
    if (!!submissions) {
        for (let i = 0; i < submissions.length; i++) {
            const row = [
                i + 1, 
                submissions[i].data.LastName, 
                submissions[i].data.FirstName, 
                submissions[i].key, 
                submissions[i].data.Timestamp,
            ];
            rowData.push(row);
        }
    }
    return rowData;
};

const getCompPdfData = (userRoster) => {
    const rowData = [];
    if (!!userRoster) {
        for (let i = 0; i < userRoster.length; i++) {
            const backgroundColor = userRoster[i].Submitted ? '#2E7D32' : '#DB3131';
            const row = [i + 1, userRoster[i].LastName, userRoster[i].FirstName, backgroundColor];
            rowData.push(row);
        }
    }
    return rowData;
};

// Helper function to convert hex color to RGB values
const hexToRgb = (hex) => {
    if (!hex) return [255, 255, 255];
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
};

// For Attendance PDF exportation
export const generateAttendancePdf = (pdfOption, formData) => {
    if (pdfOption === 'submissions') {
        try {
            const now = dayjs();
            const newPdf = new jsPDF();
            const pdfTitle = `${formData.Title} Attendance Submissions`;
            const pdfSubtitle = `Submissions as of ${now.format('M/D/YYYY @ h:mm A').replace("@", "at")}`;
        
            const titleFontSize = 18;
            const subtitleFontSize = 14;
        
            const pageWidth = newPdf.internal.pageSize.getWidth();
        
            newPdf.setFontSize(titleFontSize);
            const titleY = 25;
            const titleTextWidth = newPdf.getStringUnitWidth(pdfTitle) * titleFontSize / newPdf.internal.scaleFactor;
            const titleXCentered = (pageWidth - titleTextWidth) / 2;
            newPdf.text(pdfTitle, titleXCentered, titleY);
        
            newPdf.setFontSize(subtitleFontSize);
            const subtitleY = 35;
            const subtitleTextWidth = newPdf.getStringUnitWidth(pdfSubtitle) * subtitleFontSize / newPdf.internal.scaleFactor;
            const subtitleXCentered = (pageWidth - subtitleTextWidth) / 2;
            newPdf.text(pdfSubtitle, subtitleXCentered, subtitleY);
        
            const tableElement = document.getElementById('submissions-table');
            const tableStyles = window.getComputedStyle(tableElement);
            const headerStyles = {
                fillColor: '#700707',
                textColor: '#fff',
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 2,
                fontSize: parseInt(tableStyles.fontSize) / 1.5,
            };

            const bodyStyles = {
                halign: 'center',
                fillColor: '#6d6e71',
                textColor: '#FFF',
            };
        
            const options = {
                startY: 45,
                theme: 'grid',
                tableWidth: 180,
                headStyles: headerStyles,
                bodyStyles,
                willDrawCell: function (data) {
                    if (data.section === 'body') {
                        if (data.row.index % 2 === 0) {
                            newPdf.setFillColor(128, 130, 133);
                            newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        }
                    }
                },
                didDrawCell: function (data) {
                    if (data.section === 'body' || data.section === 'head') {
                        newPdf.setLineWidth(0.5);
                        newPdf.setDrawColor(0);
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
                    }
                },
            };

            const data = getSubPDFData(formData.Submissions);
            autoTable(newPdf, { 
                head: [['#', 'Last Name', 'First Name', 'Submission ID', 'Timestamp']],
                body: data,
                ...options,
            });
        
            const pdfExportTitle = `${formData.Title.replaceAll(" ", "-")}-Submissions-as-of-${now.format('M.D.YYYY-h:mm-A')}.pdf`;
            newPdf.save(pdfExportTitle);
            return [true, 'PDF exported successfully'];
        } catch (error) {
            console.error(error);
            return [false, 'PDF export failed']
        }
    } else {
        try {
            const now = dayjs();
            const newPdf = new jsPDF();
            const pdfTitle = `${formData.Title} Attendance Submissions`;
            const pdfSubtitle = `Submissions as of ${now.format('M/D/YYYY @ h:mm A').replace("@", "at")}`;
        
            const titleFontSize = 18;
            const subtitleFontSize = 14;
        
            const pageWidth = newPdf.internal.pageSize.getWidth();
        
            newPdf.setFontSize(titleFontSize);
            const titleY = 25;
            const titleTextWidth = newPdf.getStringUnitWidth(pdfTitle) * titleFontSize / newPdf.internal.scaleFactor;
            const titleXCentered = (pageWidth - titleTextWidth) / 2;
            newPdf.text(pdfTitle, titleXCentered, titleY);
        
            newPdf.setFontSize(subtitleFontSize);
            const subtitleY = 35;
            const subtitleTextWidth = newPdf.getStringUnitWidth(pdfSubtitle) * subtitleFontSize / newPdf.internal.scaleFactor;
            const subtitleXCentered = (pageWidth - subtitleTextWidth) / 2;
            newPdf.text(pdfSubtitle, subtitleXCentered, subtitleY);
        
            const tableElement = document.getElementById('submissions-table');
            const tableStyles = window.getComputedStyle(tableElement);
            const headerStyles = {
                fillColor: '#700707',
                textColor: '#fff',
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 2,
                fontSize: parseInt(tableStyles.fontSize) / 1.5,
            };

            const bodyStyles = {
                halign: 'center',
                fillColor: '#6d6e71',
                textColor: '#FFF',
            };
        
            const options = {
                startY: 45,
                theme: 'grid',
                tableWidth: 180,
                headStyles: headerStyles,
                bodyStyles,
                willDrawCell: function (data) {
                    if (data.section === 'body') {
                        if (data.row.index % 2 === 0) {
                            newPdf.setFillColor(128, 130, 133);
                            newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        }
                    }
                },
                didDrawCell: function (data) {
                    if (data.section === 'body' || data.section === 'head') {
                        newPdf.setLineWidth(0.5);
                        newPdf.setDrawColor(0);
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
                    }
                },
            };

            const data = getSubPDFData(formData.Submissions);
            autoTable(newPdf, { 
                head: [['#', 'Last Name', 'First Name', 'Submission ID', 'Timestamp']],
                body: data,
                ...options,
            });

            const bodyStylesComp = {
                halign: 'left',
                fillColor: '#6d6e71',
                textColor: '#FFF',
            };

            const tableHeight = newPdf.autoTable.previous.finalY;              
            const options2 = {
                startY: tableHeight + 10,
                theme: 'grid',
                tableWidth: 190,
                margin: { left: 10, right: 10 },
                headStyles: headerStyles,
                bodyStyles: bodyStylesComp,
                willDrawCell: function (data) {
                    if (data.section === 'body') {
                        const bgColor = data.row.raw[3];
                        newPdf.setFillColor(...hexToRgb(bgColor));
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                    }
                },
                didDrawCell: function (data) {
                    if (data.section === 'body' || data.section === 'head') {
                        newPdf.setLineWidth(0.5);
                        newPdf.setDrawColor(0);
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
                    }
                },
            };

            const data2 = getCompPdfData(formData.ComparedRoster);
            autoTable(newPdf, {
                head: [['#', 'Last Name', 'First Name']],
                body: data2,
                ...options2,
            });
        
            const pdfExportTitle = `${formData.Title.replaceAll(" ", "-")}-Roster-Comparison-as-of-${now.format('M.D.YYYY-h:mm-A')}.pdf`;
            newPdf.save(pdfExportTitle);
            return [true, 'PDF exported successfully'];
        } catch (error) {
            console.error(error);
            return [false, 'PDF export failed']
        }
    }
};

const getOrderTotalData = (data, countTotal) => {
    let result = '';
    for (const category in data) {
        if (data.hasOwnProperty(category)) {
            let categoryResult = `      ${category}:\n`;
    
            if (data[category].length === 0) {
                categoryResult += '            - (No Orders)\n';
            } else {
                data[category].forEach(item => {
                    const itemName = Object.keys(item)[0];
                    const quantity = item[itemName];
                    categoryResult += `         [  ] ${itemName}: {{ ${quantity} }}\n`;
                });
            }
    
            result += categoryResult;
        }
    }
  
    return result.concat(`TOTAL NUMBER OF ORDERS: {{ ${countTotal} }}` );
};

const getOptionData = (options, orderCounts) => {
    let returnData = [];
    if (!!options) {
        for (const option in options) {
            const items = options[option];
            let count = orderCounts[option];
            const row = [option, items.Entree, items.Side, items.Drink, count ? count : 0];
            returnData.push(row);
        }
    }
    return returnData
};

const getCommentTableData = (subs) => {
    let returnData = [];
    if (subs) {
        let count = 0;
        for (let i = 0; i < subs.length; i++) {
            if (subs[i].data.Comments.toLowerCase() !== 'none' && !!subs[i].data.Comments) {
                count++;
                const name = `${subs[i].data.FirstName} ${subs[i].data.LastName}`;
                const comments = subs[i].data.Comments;
                const choice = Object.keys(subs[i].data.Choice)[0];
                const row = [count, name, choice, comments];
                returnData.push(row);
            }
        }
    }
    return returnData
};

// Define data portion of table for PDF
const getPDFData = (subs) => {
    let returnData = [];
    if (subs) {
        for (let i = 0; i < subs.length; i++) {
            const name = `${subs[i].data.LastName}, ${subs[i].data.FirstName}`;
            const comments = (subs[i].data.Comments.toLowerCase() !== 'none' && !!subs[i].data.Comments) 
                ? subs[i].data.Comments 
                : '---'
            ;
            const choice = Object.keys(subs[i].data.Choice)[0];
            const row = [i+1, name, subs[i].key, subs[i].data.Timestamp, choice, comments];
            returnData.push(row);
        }
    }
    return returnData
};

// For PDF exportation
export const generateFoodOrderPDF = (pdfOption, formData, genertatedOrderData, countTotal, orderCounts) => {
    if (pdfOption === 'full-details') {
        try {
            const now = dayjs();
            const newPdf = new jsPDF({orientation: 'p', lineHeight: 1.5});
            const pdfTitle = `${formData.Title} Orders`;
            const pdfSubtitle = `Orders as of ${now.format('M/D/YYYY @ h:mm A').replace('@', 'at')}`;
            const orderDataPar = getOrderTotalData(genertatedOrderData, countTotal);
            const optionData = getOptionData(formData.Options, orderCounts);
            const submissionData = getPDFData(formData.Submissions);
        
            const titleFontSize = 18;
            const subtitleFontSize = 14;
            const paragraphFontSize = 12;
        
            const pageWidth = newPdf.internal.pageSize.getWidth();
        
            newPdf.setFontSize(titleFontSize);
            const titleY = 25;
            const titleTextWidth = newPdf.getStringUnitWidth(pdfTitle) * titleFontSize / newPdf.internal.scaleFactor;
            const titleXCentered = (pageWidth - titleTextWidth) / 2;
            newPdf.text(pdfTitle, titleXCentered, titleY);
        
            newPdf.setFontSize(subtitleFontSize);
            const subtitleY = 35;
            const subtitleTextWidth = newPdf.getStringUnitWidth(pdfSubtitle) * subtitleFontSize / newPdf.internal.scaleFactor;
            const subtitleXCentered = (pageWidth - subtitleTextWidth) / 2;
            newPdf.text(pdfSubtitle, subtitleXCentered, subtitleY);

            newPdf.setFontSize(paragraphFontSize);
            const paragraphY = 50;
            // Split the multiline text into lines
            const lines = orderDataPar.split('\n');
            const maxLineWidth = lines.reduce((maxWidth, line) => {
                const lineWidth = newPdf.getStringUnitWidth(line) * paragraphFontSize / newPdf.internal.scaleFactor;
                return Math.max(maxWidth, lineWidth);
            }, 0);
            const paragraphXCentered = (pageWidth - maxLineWidth) / 5;
            newPdf.text('ORDER TOTALS:\n', paragraphXCentered, 45);
            newPdf.text(orderDataPar, paragraphXCentered, paragraphY);
            
            // Calculate the height of each line
            const lineHeight = newPdf.getLineHeight() / newPdf.internal.scaleFactor;

            // Calculate the total height of the multiline text
            const orderDataParHeight = lines.length * lineHeight;

            // Adjust the starting Y-coordinate of the table
            const tableStartY = paragraphY + orderDataParHeight;
        
            const tableElement = document.getElementById('submissions-table');
            const tableStyles = window.getComputedStyle(tableElement);
            const headerStyles = {
                fillColor: '#700707',
                textColor: '#fff',
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 2,
                fontSize: parseInt(tableStyles.fontSize) / 1.5,
            };

            const bodyStyles = {
                halign: 'left',
                fillColor: '#6d6e71',
                textColor: '#FFF',
            };
        
            const options = {
                startY: tableStartY,
                theme: 'grid',
                tableWidth: 180,
                headStyles: headerStyles,
                bodyStyles,
                willDrawCell: function (data) {
                    if (data.section === 'body') {
                        if (data.row.index % 2 === 0) {
                            newPdf.setFillColor(128, 130, 133);
                            newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        }
                    }
                },
                didDrawCell: function (data) {
                    if (data.section === 'body' || data.section === 'head') {
                        newPdf.setLineWidth(0.5);
                        newPdf.setDrawColor(0);
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
                    }
                },
            };

            autoTable(newPdf, { 
                head: [['Option Title', 'Entree', 'Side', 'Drink', 'Orders']],
                body: optionData,
                ...options,
            });

            const tableHeight = newPdf.autoTable.previous.finalY;
            const options2 = {
                startY: tableHeight + 10,
                theme: 'grid',
                tableWidth: 190,
                margin: {left: 10, right: 10},
                headStyles: headerStyles,
                bodyStyles: { 
                    halign: 'center',
                    fillColor: '#6d6e71',
                    textColor: '#FFF',
                },
                willDrawCell: function (data) {
                    if (data.section === 'body') {
                        if (data.row.index % 2 === 0) {
                            newPdf.setFillColor(128, 130, 133);
                            newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        }
                    }
                },
                didDrawCell: function (data) {
                    if (data.section === 'body' || data.section === 'head') {
                        newPdf.setLineWidth(0.5);
                        newPdf.setDrawColor(0);
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
                    }
                },
            };

            autoTable(newPdf, { 
                head: [['#', 'Name', 'Submission ID', 'Timestamp', 'Order', 'Comments']],
                body: submissionData,
                ...options2,
            });
        
            const pdfExportTitle = `${formData.Title.replaceAll(' ', '-')}-${dayjs(formData.StartDate).format('M.D.YYYY')}-Orders-as-of-${now.format('M.D.YYYY-h:mm-A')}.pdf`;
            newPdf.save(pdfExportTitle);
            return [true, 'PDF exported successfully'];
        } catch (error) {
            console.error(error);
            return [false, error];
        }
    } else if (pdfOption === 'orders-only') {
        try {
            const now = dayjs();
            const newPdf = new jsPDF({orientation: 'p', lineHeight: 1.75});
            const pdfTitle = `${formData.Title} Orders`;
            const pdfSubtitle = `Orders as of ${now.format('M/D/YYYY @ h:mm A').replace('@', 'at')}`;
            const finalParagraph = 'If you have any comments, questions, or concerns about this order, please\ncontact Nick Nafpliotis at nnafplio@cofc.edu.'
            const orderDataPar = getOrderTotalData(genertatedOrderData, countTotal);
            const optionData = getOptionData(formData.Options, orderCounts);
            const commentsTableData = getCommentTableData(formData.Submissions);
        
            const titleFontSize = 20;
            const subtitleFontSize = 16;
            const paragraphFontSize = 14;
        
            const pageWidth = newPdf.internal.pageSize.getWidth();
        
            newPdf.setFontSize(titleFontSize);
            const titleY = 25;
            const titleTextWidth = newPdf.getStringUnitWidth(pdfTitle) * titleFontSize / newPdf.internal.scaleFactor;
            const titleXCentered = (pageWidth - titleTextWidth) / 2;
            newPdf.text(pdfTitle, titleXCentered, titleY);
        
            newPdf.setFontSize(subtitleFontSize);
            const subtitleY = 35;
            const subtitleTextWidth = newPdf.getStringUnitWidth(pdfSubtitle) * subtitleFontSize / newPdf.internal.scaleFactor;
            const subtitleXCentered = (pageWidth - subtitleTextWidth) / 2;
            newPdf.text(pdfSubtitle, subtitleXCentered, subtitleY);

            newPdf.setFontSize(paragraphFontSize);
            const paragraphY = 50;
            // Split the multiline text into lines
            const lines = orderDataPar.split('\n');
            const maxLineWidth = lines.reduce((maxWidth, line) => {
                const lineWidth = newPdf.getStringUnitWidth(line) * paragraphFontSize / newPdf.internal.scaleFactor;
                return Math.max(maxWidth, lineWidth);
            }, 0);
            const paragraphXCentered = (pageWidth - maxLineWidth) / 5;
            newPdf.text('ORDER TOTALS:\n', paragraphXCentered, 45);
            newPdf.text(orderDataPar, paragraphXCentered, paragraphY);
            
            // Calculate the height of each line
            const lineHeight = newPdf.getLineHeight() / newPdf.internal.scaleFactor;

            // Calculate the total height of the multiline text
            const orderDataParHeight = lines.length * lineHeight;

            // Adjust the starting Y-coordinate of the table
            const tableStartY = paragraphY + orderDataParHeight;
        
            const tableElement = document.getElementById('submissions-table');
            const tableStyles = window.getComputedStyle(tableElement);
            const headerStyles = {
                fillColor: '#700707',
                textColor: '#fff',
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 2,
                fontSize: parseInt(tableStyles.fontSize) / 1.5,
            };

            const bodyStyles = {
                halign: 'left',
                fillColor: '#6d6e71',
                textColor: '#FFF',
            };
        
            const options = {
                startY: tableStartY,
                theme: 'grid',
                tableWidth: 190,
                margin: {left: 10, right: 10},
                headStyles: headerStyles,
                bodyStyles,
                willDrawCell: function (data) {
                    if (data.section === 'body') {
                        if (data.row.index % 2 === 0) {
                            newPdf.setFillColor(128, 130, 133);
                            newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        }
                    }
                },
                didDrawCell: function (data) {
                    if (data.section === 'body' || data.section === 'head') {
                        newPdf.setLineWidth(0.5);
                        newPdf.setDrawColor(0);
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
                    }
                },
            };

            autoTable(newPdf, { 
                head: [['Option Title', 'Entree', 'Side', 'Drink', 'Orders']],
                body: optionData,
                ...options,
            });

            newPdf.setFontSize(subtitleFontSize)
            const tableTitle = 'Requests / Comments / Allergies';
            const title2TextWidth = newPdf.getStringUnitWidth(tableTitle) * subtitleFontSize / newPdf.internal.scaleFactor;
            const title2XCentered = (pageWidth - title2TextWidth) / 2;
            const tableHeight2 = newPdf.autoTable.previous.finalY;
            newPdf.text(tableTitle, title2XCentered, tableHeight2 + 15);

            const tableHeight = newPdf.autoTable.previous.finalY;
            const options2 = {
                startY: tableHeight + 20,
                theme: 'grid',
                tableWidth: 190,
                margin: {left: 10, right: 10},
                headStyles: headerStyles,
                bodyStyles: { 
                    halign: 'center',
                    fillColor: '#6d6e71',
                    textColor: '#FFF',
                },
                willDrawCell: function (data) {
                    if (data.section === 'body') {
                        if (data.row.index % 2 === 0) {
                            newPdf.setFillColor(128, 130, 133);
                            newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        }
                    }
                },
                didDrawCell: function (data) {
                    if (data.section === 'body' || data.section === 'head') {
                        newPdf.setLineWidth(0.5);
                        newPdf.setDrawColor(0);
                        newPdf.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'S');
                    }
                },
            };

            autoTable(newPdf, { 
                head: [['#', 'Name', 'Order', 'Requests / Comments / Allergies']],
                body: commentsTableData,
                ...options2,
            });

            newPdf.setFontSize(paragraphFontSize);
            const tableHeight3 = newPdf.autoTable.previous.finalY;
            newPdf.text(finalParagraph, paragraphXCentered, tableHeight3 + 10);
        
            const pdfExportTitle = `${formData.Title.replaceAll(' ', '-')}-Final-Orders.pdf`;
            newPdf.save(pdfExportTitle);
            return [true, 'PDF exported successfully'];
        } catch (error) {
            console.error(error);
            return [false, error];
        }
    } else {
        console.error('PDF generation failed.')
        return [false, 'PDF generation failed.'];
    }
};
