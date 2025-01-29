import jsPDF from "jspdf";
import "jspdf-autotable";

const formatCurrency = (amount) => `₹${parseFloat(amount).toFixed(2)}`;

const formatAddress = (address) => {
  const parts = [
    address.name,
    address.fullAddress,
    address.place,
    address.state,
    address.country,
    `Pincode: ${address.pincode}`
  ];
  return parts.filter(Boolean).join(", ");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export const generateInvoice = (invoiceData) => {
  const doc = new jsPDF();
  
  // Document settings
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  const usableWidth = pageWidth - (2 * margin);
  
  // Company Header
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text("ACME CORPORATION", pageWidth / 2, 25, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("123 Business Avenue, Tech City", pageWidth / 2, 32, { align: "center" });
  doc.text("Contact: (555) 123-4567 | support@acmecorp.com", pageWidth / 2, 37, { align: "center" });

  // Invoice Details Box
  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.rect(margin, 45, usableWidth, 40);

  // Left column
  doc.setFontSize(10);
  doc.text([
    `Invoice Number: ${invoiceData.invoiceId}`,
    `Date: ${formatDate(invoiceData.date)}`,
    `Customer: ${invoiceData.customerName}`,
    `Payment Method: ${invoiceData.paymentMethod.toUpperCase()}`,
    `Payment Status: ${invoiceData.paymentStatus.toUpperCase()}`
  ], margin + 5, 52);

  // Right column
  doc.text("Shipping Address:", pageWidth - margin - 60, 52);
  doc.setFontSize(9);
  const formattedAddress = formatAddress(invoiceData.customerAddress);
  doc.text(doc.splitTextToSize(formattedAddress, 55), pageWidth - margin - 60, 58);

  // Items Table
  const tableColumns = [
    { header: "#", dataKey: "index" },
    { header: "Item Description", dataKey: "name" },
    { header: "Size", dataKey: "size" },
    { header: "Qty", dataKey: "quantity" },
    { header: "Price", dataKey: "price" },
    { header: "Total", dataKey: "total" }
  ];

  const tableRows = invoiceData.items.map((item, index) => {
    const product = item.productId;
    const stock = item.stocks[0];
    return {
      index: index + 1,
      name: product.name,
      size: stock.size,
      quantity: stock.quantity,
      price: formatCurrency(product.currentPrice),
      total: formatCurrency(stock.quantity * parseFloat(product.currentPrice))
    };
  });

  doc.autoTable({
    startY: 90,
    columns: tableColumns,
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { cellWidth: 60 },
      2: { halign: "center", cellWidth: 20 },
      3: { halign: "center", cellWidth: 20 },
      4: { halign: "right", cellWidth: 30 },
      5: { halign: "right", cellWidth: 30 }
    }
  });

  // Summary Box
  const finalY = doc.previousAutoTable.finalY + 10;
  const summaryBoxWidth = 80;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;
  
  doc.rect(summaryBoxX, finalY, summaryBoxWidth, 40);
  
  const summaryItems = [
    { label: "Subtotal:", value: formatCurrency(invoiceData.subtotal) },
    { label: "Shipping:", value: formatCurrency(invoiceData.shippingCharge) },
    { label: "Discount:", value: `-${formatCurrency(invoiceData.discountApplied)}` },
    { label: "Total:", value: formatCurrency(invoiceData.totalAmount) }
  ];

  doc.setFontSize(10);
  summaryItems.forEach((item, index) => {
    const y = finalY + (index + 1) * 8;
    doc.setFont("helvetica", item.label === "Total:" ? "bold" : "normal");
    doc.text(item.label, summaryBoxX + 5, y);
    doc.text(item.value, summaryBoxX + summaryBoxWidth - 5, y, { align: "right" });
  });

  // Order Status
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(
    `Order Status: ${invoiceData.orderStatus.toUpperCase()}`,
    margin,
    finalY + 20
  );

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Thank you for your business!",
    pageWidth / 2,
    doc.internal.pageSize.height - 10,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`Invoice_${invoiceData.invoiceId}.pdf`);
};