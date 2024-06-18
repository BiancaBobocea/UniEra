import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { RouterModule } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-grade-item',
  templateUrl: './grade-item.page.html',
  styleUrls: ['./grade-item.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, IonRouterOutlet]
})
export class GradeItemPage implements OnInit {
  materiaSelectata$ = this.stateManagerService.materiaSelectata$;
  constructor(private stateManagerService: StateManagerService) { }

  ngOnInit() {
  }

}
