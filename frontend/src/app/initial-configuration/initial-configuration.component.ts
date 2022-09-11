import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {SIMULATION_PATH} from "../app-routing-paths";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {config} from "rxjs";

@Component({
  selector: 'app-initial-configuration',
  templateUrl: './initial-configuration.component.html',
  styleUrls: ['./initial-configuration.component.scss']
})
export class InitialConfigurationComponent implements OnInit {
  nodesType1FC = new FormControl("10", [Validators.required, Validators.min(2)]);

  form = this.formBuilder.group({
    nodesType1FC: this.nodesType1FC
  });

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  onClick(): void {
    if (!this.nodesType1FC.valid) {
      this.snackBar.open("Błędnie wypełniony formularz!",'',{ duration: 500 });
    } else {
      this.snackBar.open("Przechodzenie do symulacji",'',{ duration: 500 });
      this.router.navigate([SIMULATION_PATH, this.nodesType1FC.value], {relativeTo: this.activatedRoute.parent});
    }

  }

}
