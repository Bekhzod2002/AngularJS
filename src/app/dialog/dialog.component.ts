import { Component, Inject, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createInjectableType } from '@angular/compiler';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {


  ConditionProduct: string[] = ["New", "Second Hand", "B/Y"]
  productForm !: FormGroup
  actionBtn: string = "Save" 
  constructor(
    private FormBuilder: FormBuilder, 
    private api: ApiService, 
    private dialogref: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) { }

  ngOnInit(): void {
    this.productForm = this.FormBuilder.group({
      ProductName: ["", Validators.required],
      Category: ["", Validators.required],
      Condition: ["", Validators.required],
      Price: ["", Validators.required],
      Comment: ["", Validators.required],
      Date: ["", Validators.required]
    })
    if(this.editData) {
      this.actionBtn = "Update"
      this.productForm.controls['ProductName'].setValue(this.editData.ProductName);
      this.productForm.controls['Category'].setValue(this.editData.Category);
      this.productForm.controls['Condition'].setValue(this.editData.Condition);
      this.productForm.controls['Price'].setValue(this.editData.Price);
      this.productForm.controls['Comment'].setValue(this.editData.Comment);
      this.productForm.controls['Date'].setValue(this.editData.Date);
    }
  }
  addProduct() {
    if(!this.editData) {
      if(this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:() =>{
            alert("Product was added successfully")
            this.productForm.reset()
            this.dialogref.close("save")
          },
          error:() =>{
            alert("Something went wrong while adding")
          }
        })
      } 
    } else{
      this.updateProduct()
    }
  }

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id )
    .subscribe({
      next:(res) => {
        alert("Product updated successfully")
        this.productForm.reset()
        this.dialogref.close('update')
      },
      error:() => {
        alert("Something went wrong while updating")
      }
    })
  }
}
