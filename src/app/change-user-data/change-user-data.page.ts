import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserDataService } from '../services/user-data/user-data.service';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'app-change-user-data',
  templateUrl: './change-user-data.page.html',
  styleUrls: ['./change-user-data.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChangeUserDataPage implements OnInit {
  listaStudenti$ = this.stateManagerService.listaStudenti$;
  listaProfesori$ = this.stateManagerService.listaProfesori$;

  selectedCategory: 'studenti' | 'profesori' = 'studenti';

  selectedUser: any = undefined;
  searchTerm: string = '';

  showUpdateDataModal: boolean = false;
  public results: any[] | undefined = undefined;

  updateDataForm = this.fb.group({
    firstName: ['', Validators.required], 
    lastName: ['', Validators.required], 
    cnp: ['', Validators.required],
    phoneNumber: ['', Validators.required], 
    email: ['', [Validators.email, Validators.required]],
    matricolNumber: ['', Validators.required],
    specialization: ['', Validators.required],
    year: ['', Validators.required], 
    group: ['', Validators.required], 
    subgroup: ['', Validators.required], 
  });

  constructor(
    private readonly userDataService: UserDataService,
    private readonly stateManagerService: StateManagerService,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userDataService.getProfessorList();
    this.userDataService.getStudentList();

    this.listaStudenti$.subscribe((data) => {
      this.results = data;
    });
  }

  selectCategory(category: 'studenti' | 'profesori', data: any) {
    this.selectedCategory = category;
    this.searchTerm = '';
    if (category === 'studenti') {
      this.results = data.listaStudenti;
    } else {
      this.results = data.listaProfesori;
    }
  }

  handleInput(event: any, data: any) {
    const query = event.target.value.toLowerCase();
    const chosenList = this.selectedCategory === 'studenti' ? data.listaStudenti : data.listaProfesori;
    this.results = chosenList.filter((d: any) => d.firstName.toLowerCase().indexOf(query) > -1 || d.lastName.toLowerCase().indexOf(query) > -1);
  }

  editInfoForSelection(selectedUser: any) {
    this.selectedUser = selectedUser;
    this.showUpdateDataModal = true;
    this.updateDataForm.patchValue(selectedUser);
  }

  updateUserData() {
    if (this.updateDataForm.invalid) {
      return;
    }
    this.showUpdateDataModal = false;
    const updatedData = {...this.updateDataForm.value, role: this.selectedUser.role, id: this.selectedUser.id};
    this.userDataService.updateUserDetails(updatedData);
  }
}
