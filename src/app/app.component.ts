import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      customerName: new FormControl('', [Validators.required]),
      customerEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      customerTel: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
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
      this.http
        .get('/api/generate-pdf/view-pdf', { responseType: 'arraybuffer' })
        .subscribe(
          (data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  downloadPDF() {
    if (this.submittedItems.length > 0) {
  // Make a GET request to the /download-pdf endpoint
  this.http.get('/api/generate-pdf/download-pdf', { responseType: 'arraybuffer' }).subscribe(
    (data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      a.click();
    },
    (error) => {
      console.error(error);
    }
  );
    }
  }
}
