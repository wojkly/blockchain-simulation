import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Node} from "../../model/node";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {COUNTRIES} from "../../model/country";
import {VisualisationService} from "../../../services/visualisation.service";
import {Graph} from "../../model/graph";

@Component({
  selector: 'app-edit-miner',
  templateUrl: './edit-miner.component.html',
  styleUrls: ['./edit-miner.component.scss']
})
export class EditMinerComponent implements OnInit {

  minerMoneyFC: FormControl = new FormControl(this.data.miner.money, [Validators.required, Validators.min(1)]);
  minerPowerFC: FormControl = new FormControl(this.data.miner.computingPower, [Validators.required, Validators.min(1), Validators.max(10)]);
  minerCountryFC: FormControl = new FormControl(this.data.miner.country, [Validators.required]);

  form = this.formBuilder.group({
    minerMoneyFC: this.minerMoneyFC,
    minerPowerFC: this.minerPowerFC,
    minerCountryFC: this.minerCountryFC,
  });

  minerToEdit: Node;
  private graph = new Graph(new Map<number, Node>());
  COUNTRIES = COUNTRIES;

  constructor(private dialogRef: MatDialogRef<any>,
              private formBuilder: FormBuilder,
              private visualizationService: VisualisationService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.minerToEdit = data.miner;
  }

  ngOnInit(): void {
    this.visualizationService.getGraph().subscribe((res) => {
      this.graph = res.graph;
    })
  }

  formValidation(){
    return this.form.valid;
  }

  minerEdited(){
    // @ts-ignore
    this.graph.nodes.get(this.minerToEdit.id).money = this.minerMoneyFC.value
    // @ts-ignore
    this.graph.nodes.get(this.minerToEdit.id).computingPower = this.minerPowerFC.value
    // @ts-ignore
    this.graph.nodes.get(this.minerToEdit.id).country = this.minerCountryFC.value

    this.dialogRef.close(this.graph)
  }
}
