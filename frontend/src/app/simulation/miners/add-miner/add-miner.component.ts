import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {COUNTRIES} from "../../model/country";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VisualisationService} from "../../../services/visualisation.service";
import {Graph} from "../../model/graph";
import {Node} from "../../model/node";
import {tap} from "rxjs";

@Component({
  selector: 'app-add-miner',
  templateUrl: './add-miner.component.html',
  styleUrls: ['./add-miner.component.scss']
})
export class AddMinerComponent implements OnInit {
  numberOfMinersFC: FormControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  minersFormArray: FormArray = this.formBuilder.array([]);

  form = this.formBuilder.group({
    numberOfMinersFC: this.numberOfMinersFC,
    miners: this.minersFormArray
  });

  get miners() {
    return this.form.controls["miners"] as FormArray;
  }

  minerNodesBeforeChange = 1;
  COUNTRIES = COUNTRIES;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.miners.push(this.getDefaultMinerFormGroup())

    this.numberOfMinersFC.valueChanges
      .pipe(
        tap((value: number) => {
          if (this.numberOfMinersFC.invalid) {
            this.miners.clear();
            this.minerNodesBeforeChange = 0;
          }
        })
      )
      .subscribe();

    this.form.markAllAsTouched();
  }

  formValidation(){
    return this.form.valid;
  }

  setMinersNumber(): void {
    const minersBefore = this.minerNodesBeforeChange;
    const minersNow = this.numberOfMinersFC.value;
    if (minersBefore < minersNow) {
      for (let i=minersBefore; i<minersNow; i++) {
        this.miners.push(this.getDefaultMinerFormGroup())
      }
    } else {
      for (let i=minersBefore; i>minersNow; i--) {
        this.miners.removeAt(this.miners.length - 1);
      }
    }

    this.minerNodesBeforeChange = minersNow;
    this.form.markAllAsTouched();
  }

  private getDefaultMinerFormGroup(): FormGroup {
    return this.formBuilder.group({
      power: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
      country: new FormControl('POLAND', [Validators.required]),
      money: new FormControl(500, [Validators.required, Validators.min(0), Validators.max(100000)]),
    })
  }

  onClick(): void {
    this.dialogRef.close(this.miners.value)
  }
}
