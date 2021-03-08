
import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DataService} from '../data.service';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

export interface User {
  id?: number;
  first: string;
  last: string;
  email: string;
  phone: string;
  location: string;
  hobby: string;
  added?: Date;
  action?: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  public newUserForm: FormGroup;
  action: string;
  localData: User;

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      first: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      last: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]),
      location: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]),
      hobby: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)])
    });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.newUserForm.controls[controlName].hasError(errorName);
  }

  constructor(private dataService: DataService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<DialogComponent>,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {
    console.log(data);

    const added = new Date();
    this.localData = {...data, added};
    console.log('the form data', this.localData);
    this.action = this.localData.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.localData});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}
