import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SIMULATION_PATH} from "../app-routing-paths";
import {FormArray, FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ParametersService} from "../services/parameters.service";
import {COUNTRIES} from "../simulation/model/country";

@Component({
  selector: 'app-initial-configuration',
  templateUrl: './initial-configuration.component.html',
  styleUrls: ['./initial-configuration.component.scss']
})
export class InitialConfigurationComponent implements OnInit {
  nodesType1FC: FormControl = new FormControl(5, [Validators.required, Validators.min(1)]);
  nodesType2FC: FormControl = new FormControl(5, [Validators.required, Validators.min(1)]);
  nodesType3FC: FormControl = new FormControl(5, [Validators.required, Validators.min(1)]);
  nodesType4FC: FormControl = new FormControl(5, [Validators.required, Validators.min(1)]);

  minersFormArray: FormArray = this.formBuilder.array([]);

  form = this.formBuilder.group({
    nodesType1FC: this.nodesType1FC,
    nodesType2FC: this.nodesType2FC,
    nodesType3FC: this.nodesType3FC,
    nodesType4FC: this.nodesType4FC,
    miners: this.minersFormArray
  });

  COUNTRIES = COUNTRIES;

  get miners() {
    return this.form.controls["miners"] as FormArray;
  }
  minerNodesBeforeChange: number = this.parametersService.getMinerNodes();
  numberOfNodes: number = 20;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private parametersService: ParametersService) {
  }

  ngOnInit(): void {
    this.setNodes();
    this.numberOfNodes = this.parametersService.getAllNodes();

    for (let i = 0; i < 5; i++) {
      this.miners.push(this.formBuilder.group({
        power: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
        country: new FormControl('', [Validators.required]),
        money: new FormControl(100, [Validators.required, Validators.min(0), Validators.max(10000)]),
      }))
    }

    this.form.markAllAsTouched();
  }

  formValidation(){
    return this.form.valid;
  }

  onClick(): void {
    this.snackBar.open("Przechodzenie do symulacji",'',{ duration: 500 });
    this.setNodes();
    this.router.navigate([SIMULATION_PATH], {relativeTo: this.activatedRoute.parent});
  }

  setNodes(): void {
    this.parametersService.setFullNodes(this.nodesType1FC.value);
    this.parametersService.setLightNodes(this.nodesType2FC.value);
    this.parametersService.setMinerNodes(this.nodesType3FC.value);
    this.parametersService.setListeningNodes(this.nodesType4FC.value);
    this.parametersService.setInitialMinersData(this.miners.value);
  }

  setNumberOfNodes(): void{
    this.numberOfNodes = this.nodesType1FC.value + this.nodesType2FC.value + this.nodesType3FC.value + this.nodesType4FC.value;
  }

  setMinersNumber(): void {
    const minersBefore = this.minerNodesBeforeChange;
    const minersNow = this.nodesType3FC.value;
    console.log(minersBefore)
    console.log(minersNow)
    this.setNumberOfNodes();
    if (minersBefore < minersNow) {
      for (let i=minersBefore; i<minersNow; i++) {
        this.miners.push(this.formBuilder.group({
          power: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
          country: new FormControl('', [Validators.required]),
          money: new FormControl(100, [Validators.required, Validators.min(0), Validators.max(10000)]),
        }))
      }
    } else {
      for (let i=minersBefore; i>minersNow; i--) {
        this.miners.removeAt(this.miners.length - 1);
      }
    }

    this.minerNodesBeforeChange = minersNow;
    this.form.markAllAsTouched();
  }

}
