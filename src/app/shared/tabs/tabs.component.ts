import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, person, book} from 'ionicons/icons';
import { take } from 'rxjs';
import { StateManagerService } from 'src/app/services/state-manager.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

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
  user$ = this.stateManagerService.user$;
  constructor(private stateManagerService: StateManagerService, private userDataService: UserDataService, private router: Router) { }

  ngOnInit() {
    addIcons({home, person, book})
  }

  tabClicked({tab}: any) {
    console.log(tab);
    this.selectedTab = tab;

    this.router.navigate([tab], { replaceUrl: true });

    switch (tab) {
      case 'welcome-student':
        this.user$.pipe(take(2)).subscribe((user: any) => {
          if(user?.uid) {
            console.log(user?.uid)
            this.userDataService.getUsersNotifications(user?.uid);
          }
        });

    
        this.stateManagerService.userDetails$.pipe(take(1)).subscribe((userDetails) => {
          if (userDetails) {
            this.userDataService.getTimeTable(userDetails);
          }
        });
        break;

      case 'add-grading-system':
        this.userDataService.getClassesList();
        this.stateManagerService.updateState({
          materiaSelectata: null,
        });
        break;
    }
  }
}
