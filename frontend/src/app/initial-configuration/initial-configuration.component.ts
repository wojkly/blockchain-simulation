import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SIMULATION_PATH} from "../app-routing-paths";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ParametersService} from "../services/parameters.service";
import {SimulationService} from "../services/simulation.service";

@Component({
  selector: 'app-initial-configuration',
  templateUrl: './initial-configuration.component.html',
  styleUrls: ['./initial-configuration.component.scss']
})
export class InitialConfigurationComponent implements OnInit {
  nodesType1FC: FormControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  nodesType2FC: FormControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  nodesType3FC: FormControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  nodesType4FC: FormControl = new FormControl(1, [Validators.required, Validators.min(1)]);

  form = this.formBuilder.group({
    nodesType1FC: this.nodesType1FC,
    nodesType2FC: this.nodesType2FC,
    nodesType3FC: this.nodesType3FC,
    nodesType4FC: this.nodesType4FC
  });

  numberOfNodes: number = 4;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar,
              private parametersService: ParametersService,
              private simulationService: SimulationService) {
  }

  ngOnInit(): void {
  }

  onClick(): void {
    if (!(this.nodesType1FC.valid && this.nodesType2FC.valid && this.nodesType3FC.valid && this.nodesType4FC.valid)) {
      this.snackBar.open("Błędnie wypełniony formularz!",'',{ duration: 500 });
    } else {
      this.snackBar.open("Przechodzenie do symulacji",'',{ duration: 500 });
      this.setNodes();
      this.router.navigate([SIMULATION_PATH], {relativeTo: this.activatedRoute.parent});
    }
  }

  setNodes(): void {
    this.parametersService.setFullNodes(this.nodesType1FC.value);
    this.parametersService.setLightNodes(this.nodesType2FC.value);
    this.parametersService.setMinerNodes(this.nodesType3FC.value);
    this.parametersService.setListeningNodes(this.nodesType4FC.value);
  }

  setNumberOfNodes(): void{
    this.numberOfNodes = this.nodesType1FC.value + this.nodesType2FC.value + this.nodesType3FC.value + this.nodesType4FC.value;
  }

}
