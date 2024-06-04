import { Injectable } from '@angular/core';
import { StateManagerService } from '../state-manager.service';
import { User } from 'firebase/auth';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'src/environments/environment';
import { combineLatest, take } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(
    private stateManagerService: StateManagerService,
    private alertController: AlertController,
    private readonly router: Router
  ) {}

  async saveUserData(userDetails: any, user: User) {
    // Add a new student in collection "students"
    await setDoc(doc(db, 'users', `${user?.uid}`), userDetails).then(
      async () => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'User created successfully',
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  async getUserData(user: User) {
    // Get the student details from the collection "students"
    const docRef = doc(db, 'users', `${user?.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.getTimeTable(docSnap.data());
      this.stateManagerService.updateState({
        userDetails: docSnap.data(),
        user: user,
      });
      this.router.navigate([
        `/welcome-${docSnap.data()['role'] === 'admin' ? 'admin' : 'student'}`,
      ]);
    } else {
      console.log('No user Details!');
    }
  }

  async getTimeTable(userDetails: DocumentData) {
    const year = userDetails['year'];
    const specialization = userDetails['specialization'];
    const group = userDetails['group'];
    const subGroup = userDetails['subgroup'];

    this.stateManagerService.semestrulCurent$
      .pipe(take(1))
      .subscribe(async (semestrulCurent) => {
        const querySaptImpara = await getDocs(
          collection(
            db,
            'orar',
            `${specialization}/anul${year}/grupa${group}/subgrupa${subGroup}/${semestrulCurent}/saptamanaImpara`
          )
        );
        let saptamanaImpara: any = {};
        querySaptImpara.forEach((zi) => {
          saptamanaImpara[zi.id] = { ...zi.data() };
        });
        console.log('Orar Saptamana Impara:', saptamanaImpara);
        this.stateManagerService.updateState({ saptamanaImpara });

        const querySaptPara = await getDocs(
          collection(
            db,
            'orar',
            `${specialization}/anul${year}/grupa${group}/subgrupa${subGroup}/${semestrulCurent}/saptamanaPara`
          )
        );
        let saptamanaPara: any = {};
        querySaptPara.forEach((zi) => {
          console.log('Zi:', zi.data());
          saptamanaPara[zi.id] = { ...zi.data() };
        });
        console.log('Orar Saptamana Para:', saptamanaPara);
        this.stateManagerService.updateState({ saptamanaPara });
      });
  }

  async getProfessorList() {
    // Get the professor list from the collection "profesori"
    const querySnapshot = await getDocs(collection(db, 'users'));
    let profesori: any = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()['role'] === 'teacher') {
        profesori.push({ ...doc.data(), id: doc.id });
      }
    });
    this.stateManagerService.updateState({ listaProfesori: profesori });
    console.log('Profesori:', profesori);
  }

  async getStudentList() {
    // Get the professor list from the collection "profesori"
    const querySnapshot = await getDocs(collection(db, 'users'));
    let studenti: any = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()['role'] === 'student') {
        studenti.push({ ...doc.data(), id: doc.id });
      }
    });
    this.stateManagerService.updateState({ listaStudenti: studenti });
    console.log('Studenti:', studenti);
  }

  async addTimetable(timetable: any, saptamanaSelectata: string) {
    console.log('Timetable:', timetable);
    combineLatest([
      this.stateManagerService.filtreAdaugareOrar$,
      this.stateManagerService.semestrulSelectat$,
      this.stateManagerService.userDetails$,
    ])
      .pipe(take(1))
      .subscribe(
        async ([filtreAdaugareOrar, semestrulSelectat, userDetails]) => {
          let query = await getDocs(
            collection(
              db,
              'orar',
              `${filtreAdaugareOrar.specialization}/anul${filtreAdaugareOrar.year}/grupa${filtreAdaugareOrar.group}/subgrupa${filtreAdaugareOrar.subGroup}/${semestrulSelectat}/${saptamanaSelectata}`
            )
          );

          console.log(
            'Query:',
            `${filtreAdaugareOrar.specialization}/anul${filtreAdaugareOrar.year}/grupa${filtreAdaugareOrar.group}/subgrupa${filtreAdaugareOrar.subGroup}/${semestrulSelectat}/${saptamanaSelectata}`
          );

          query.forEach((zi) => {
            console.log('Zi:', zi.id);
            const noulOrar = timetable[saptamanaSelectata].filter(
              (item: any) => item.mappedName.toLowerCase() === zi.id
            )[0];
            console.log('noulOrar:', noulOrar);
            console.log('saptamanaSelectata:', saptamanaSelectata);
            updateDoc(zi.ref, noulOrar);
          });

          this.getTimeTable(userDetails);
        }
      );
  }

  async getCurrentSemester() {
    // Get the current semester from the collection "semestruCurent"
    const sem1DocRef = doc(db, 'semestre', 'semestrul1');
    const sem1DocSnap = await getDoc(sem1DocRef);

    const sem2DocRef = doc(db, 'semestre', 'semestrul2');
    const sem2DocSnap = await getDoc(sem2DocRef);

    if (sem1DocSnap.exists() && sem2DocSnap.exists()) {
      const sem1StartDate = Date.parse(sem1DocSnap.data()['startDate']);
      const sem1EndDate = Date.parse(sem1DocSnap.data()['endDate']);
      const sem2StartDate = Date.parse(sem2DocSnap.data()['startDate']);
      const currentDate = Date.now();

      if (sem1StartDate < currentDate && currentDate < sem1EndDate) {
        this.stateManagerService.updateState({ semestrulCurent: 'semestrul1' });
        console.log('Semestrul 1');
      } else if (currentDate > sem2StartDate) {
        this.stateManagerService.updateState({ semestrulCurent: 'semestrul2' });
        console.log('Semestrul 2');
      } else {
        console.log('Vacanta');
      }
    }
  }

  async addClass(classDetails: any) {
    // Add a new class in collection "classes"
    await addDoc(collection(db, 'materii'), { ...classDetails }).then(
      async () => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Class added successfully',
          buttons: ['OK'],
        });

        await alert.present();
        await this.getClassesList();
      }
    );
  }

  async deleteClass(classId: string) {
    // Delete a class from the collection "materii"
    await deleteDoc(doc(db, 'materii', classId)).then(async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Class deleted successfully',
        buttons: ['OK'],
      });
      await alert.present();
      await this.getClassesList();
    });
  }

  async getClassesList(materiaSelectata: any | null = null) {
    // Get the class list from the collection "classes"
    const querySnapshot = await getDocs(collection(db, 'materii'));
    let materii: any = [];
    querySnapshot.forEach((doc) => {
      materii.push({ ...doc.data(), id: doc.id });
      if (materiaSelectata && doc.id === materiaSelectata?.id) {
        this.stateManagerService.updateState({ materiaSelectata: doc.data() });
      }
    });
    this.stateManagerService.updateState({ listaMaterii: materii });
    if (materiaSelectata) {

    }
    console.log('Materii:', materii);
  }

  async updateClass(
    itemSelectat: string,
    materia: string,
    grupa: string,
    subgrupa: string,
    procentaj = 0
  ) {
    console.log('addItem', itemSelectat, materia);
    const docRef = doc(db, 'materii', materia);
    const docSnap = await getDoc(docRef);

    const currentData = docSnap.data();
    const currentGrupa = currentData ? currentData[`grupa${grupa}`] : {};
    const currentSubgrupa = currentGrupa && currentGrupa[`subgrupa${subgrupa}`]
      ? currentGrupa[`subgrupa${subgrupa}`]
      : [];

    const item = currentSubgrupa ? currentSubgrupa.find((item: any) => item.type === itemSelectat) : null;
    if(item) {
      item.percentage = procentaj;
    } else {
      currentSubgrupa.push({
        type: itemSelectat,
        percentage: procentaj,
        grades: [],
      });
    }
    updateDoc(docRef, {
      ...currentData,
      [`grupa${grupa}`]: {
        ...currentGrupa,
        [`subgrupa${subgrupa}`]: currentSubgrupa,
      },
    }).then(() => this.getClassItems(materia, grupa, subgrupa));
  }

  async getClassItems(materia: string, grupa: string, subgrupa: string) {
    console.log('getClassItems', materia, grupa, subgrupa)
    const docRef = doc(db, 'materii', materia);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log('No such document!');
      return;
    }
    const currentData = docSnap.data();
    const currentGrupa = currentData ? currentData[`grupa${grupa}`] : {};
    const currentSubgrupa = currentGrupa
      ? currentGrupa[`subgrupa${subgrupa}`]
      : [];
    this.stateManagerService.updateState({
      listaElementeCurs: currentSubgrupa,
    });
  }

  async addGrade(
    student: any,
    materia: any,
    grupa: any,
    subgrupa: any,
    elementCurs: string,
    grade: number
  ) {
    console.log('addGrade', student, materia, grupa, subgrupa, elementCurs, grade);
    const docRef = doc(db, 'materii', materia.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log('No such document!');
      return;
    }
    const currentData = docSnap.data();
    const currentGrupa = currentData ? currentData[`grupa${grupa}`] : {};
    const currentSubgrupa = currentGrupa
      ? currentGrupa[`subgrupa${subgrupa}`]
      : [];
    const item = currentSubgrupa.find((item: any) => item.type === elementCurs);
    if (item) {
      item.grades.push({
        studentId: student.id,
        grade: grade,
      });
    }
    updateDoc(docRef, {
      ...currentData,
      [`grupa${grupa}`]: {
        ...currentGrupa,
        [`subgrupa${subgrupa}`]: currentSubgrupa,
      },
    }).then(() => this.getClassesList(materia));
  }

  clearUserState() {
    this.stateManagerService.clearState();
  }
}
