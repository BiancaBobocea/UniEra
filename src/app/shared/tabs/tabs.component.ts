import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, person, book} from 'ionicons/icons';
import { StateManagerService } from 'src/app/services/state-manager.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class TabsComponent  implements OnInit {
  selectedTab!: string;
  userDetails$ = this.stateManagerService.userDetails$;
  constructor(private stateManagerService: StateManagerService) { }

  ngOnInit() {
    addIcons({home, person, book})
  }

  tabClicked({tab}: any) {
    console.log(tab);
    this.selectedTab = tab;
  }
}
