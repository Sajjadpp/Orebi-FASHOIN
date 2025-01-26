import jsPDF from "jspdf";
import 'jspdf-autotable';

export const generateInvoice = (invoiceData) => {
  const doc = new jsPDF();

  // Company Header
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.setFont('helvetica', 'bold');
  doc.text("ACME CORPORATION", 105, 25, null, null, "center");
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text("123 Business Avenue, Tech City", 105, 32, null, null, "center");
  doc.text("Contact: (555) 123-4567 | support@acmecorp.com", 105, 37, null, null, "center");

  // Invoice Details Box
  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.rect(15, 50, 180, 35);

  doc.setFontSize(10);
  doc.text(`Invoice Number: ${invoiceData.invoiceId}`, 20, 60);
  doc.text(`Invoice Date: ${invoiceData.date}`, 20, 67);
  doc.text(`Customer: ${invoiceData.customerName}`, 20, 74);

  doc.text("Billing Address:", 140, 60);
  doc.text(invoiceData.customerAddress || "N/A", 140, 67, {maxWidth: 50});

  // Items Table
  doc.autoTable({
    startY: 90,
    head: [['#', 'Item Description', 'Quantity', 'Unit Price', 'Total']],
    body: invoiceData.items.map((item, index) => [
      index + 1,
      item.name,
      item.quantity || 1,
      `₹${item.price.toFixed(2)}`,
      `₹${((item.quantity || 1) * item.price).toFixed(2)}`
    ]),
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: {halign: 'center', cellWidth: 10},
      1: {cellWidth: 80},
      2: {halign: 'center', cellWidth: 20},
      3: {halign: 'right', cellWidth: 30},
      4: {halign: 'right', cellWidth: 30}
    }
  });

  // Totals Box
  const finalY = doc.previousAutoTable.finalY + 10;
  doc.rect(130, finalY, 65, 25);
  
  doc.setFontSize(10);
  doc.text(`Subtotal:`, 135, finalY + 7);
  doc.text(`₹${invoiceData.subtotal.toFixed(2)}`, 190, finalY + 7, {align: 'right'});
  
  doc.text(`Tax (${invoiceData.taxRate || 0}%):`, 135, finalY + 14);
  doc.text(`₹${invoiceData.tax.toFixed(2)}`, 190, finalY + 14, {align: 'right'});
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Total:`, 135, finalY + 21);
  doc.text(`₹${invoiceData.totalAmount.toFixed(2)}`, 190, finalY + 21, {align: 'right'});

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text("Thank you for your business!", 105, doc.internal.pageSize.height - 10, null, null, "center");

  doc.save(`Invoice_${invoiceData.invoiceId}.pdf`);
};