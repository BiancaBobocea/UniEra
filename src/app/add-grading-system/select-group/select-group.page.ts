import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.page.html',
  styleUrls: ['./select-group.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class SelectGroupPage implements OnInit {
  materiaSelectata$ = this.stateManagerService.materiaSelectata$;

  constructor(private readonly stateManagerService: StateManagerService, private router: Router) { }

  ngOnInit() {
  }

  accordionGroupChange = (ev: any) => {
    this.stateManagerService.updateState({
      grupaSelectata: ev.detail.value,
    });
  };

  selectSubgroup = (subgroup: string) => {
    this.stateManagerService.updateState({
      subgrupaSelectata: subgroup,
    });
    this.router.navigate(['/grade-item/course-items']);
  }
}
