// api/generate-pdf.js
const express = require('express');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const puppeteer = require('puppeteer');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const app = express();

app.get('/view-pdf', async (req, res) => {
  try {
    const pdfDefinition = {
      content: [
        {
          text: 'Albright Invoice',
          style: 'header',
          alignment: 'center',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Item Name', 'Quantity', 'Price Per Item', 'Total Price'],
              ...this.submittedItems.map((item) => [
                item.itemName,
                item.quantity,
                item.pricePerItem,
                item.totalPrice,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(pdfMake.createPdf(pdfDefinition).getBuffer(), { waitUntil: 'networkidle2' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      displayHeaderFooter: false,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/download-pdf', async (req, res) => {
  try {
    const pdfDefinition = {
      content: [
        {
          text: 'Albright Invoice',
          style: 'header',
          alignment: 'center',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Item Name', 'Quantity', 'Price Per Item', 'Total Price'],
              ...this.submittedItems.map((item) => [
                item.itemName,
                item.quantity,
                item.pricePerItem,
                item.totalPrice,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      displayHeaderFooter: false,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdfBuffer);

    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;
