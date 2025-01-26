
const generateInvoice = (invoiceData, res) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice_${invoiceData.invoiceId}.pdf`
    );

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add title
    doc.fontSize(18).text("Invoice", { align: "center" });
    doc.moveDown();

    // Add Invoice Details
    doc.fontSize(12);
    doc.text(`Invoice ID: ${invoiceData.invoiceId}`);
    doc.text(`Date: ${invoiceData.date}`);
    doc.text(`Customer Name: ${invoiceData.customerName}`);
    doc.text(`Total Amount: ₹${invoiceData.totalAmount}`);
    doc.moveDown();

    // Add line items
    doc.fontSize(14).text("Items:");
    doc.moveDown();

    doc.fontSize(12);
    invoiceData.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - ₹${item.price}`);
    });

    doc.moveDown();
    doc.text("Thank you for your business!", { align: "center" });

    // End the PDF document
    doc.end();

    // Handle stream errors
    res.on("error", (err) => {
      console.error("Response stream error:", err);
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    if (!res.headersSent) {
      res.status(500).send("Error generating invoice");
    }
  }
};

module.exports = generateInvoice;
