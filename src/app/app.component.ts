import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import * as pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pdf-invoice';
  invoiceForm: FormGroup;
  submittedItems: any[] = []; // Array to store submitted items

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      customerName: new FormControl('', [Validators.required]),
      customerEmail: new FormControl('', [Validators.required, Validators.email]),
      customerTel: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      customerAddress: new FormControl('', [Validators.required]),
      invoiceNumber: new FormControl('', [Validators.required]),
      itemName: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      pricePerItem: new FormControl('', [Validators.required]),
      // Add more form fields and validators here
    });
  }

  addItem() {
    const customerName = this.invoiceForm.value.customerName;
    const invoiceNumber = this.invoiceForm.value.invoiceNumber;
    const itemName = this.invoiceForm.value.itemName;
    const quantity = this.invoiceForm.value.quantity;
    const pricePerItem = this.invoiceForm.value.pricePerItem;
    const totalPrice = quantity * pricePerItem;
    const data = {
      customerName: customerName,
      invoiceNumber: invoiceNumber,
      itemName: itemName,
      quantity: quantity,
      pricePerItem: pricePerItem,
      totalPrice: totalPrice,
    };

    this.submittedItems.push(data);
    console.log(this.submittedItems);

    this.invoiceForm.reset();
  }


  viewPDF() {
    if (this.submittedItems.length > 0) {
      const pdfDefinition: any = {
        content: [
          // using a { text: '...' } object lets you set styling properties
          { text: 'INVOICE', fontSize: 24 },
          'Albright Sunguti',
          'sungutialbright@gmail.com ',
          { text: 'Tel : 0799735661', fontSize: 15 },
        
            {
              columns: [
                'Bill to :',
                {
                  width: '60%',
                  text : this.invoiceForm.value.customerName
                  
                },
                {
                  width: '40*',
                  text: 'Second column'
                },
              ],
              // optional space between columns
              columnGap: 20
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

      // Generate the PDF
      const pdfDoc = pdfMake.createPdf(pdfDefinition);

     //open in new tab
    pdfDoc.getDataUrl((dataUrl) => {
      window.open(dataUrl, '_blank');
    });
    }
  }

  downloadPDF() {
    if (this.submittedItems.length > 0) {
      const pdfDefinition: any = {
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

      // Generate the PDF
      const pdfDoc = pdfMake.createPdf(pdfDefinition);
      // Download the PDF as a file
         // Download the PDF as a file
    pdfDoc.getBlob((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
    }
  }

}
