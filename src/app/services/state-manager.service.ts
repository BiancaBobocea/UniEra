import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { BehaviorSubject, map } from 'rxjs';
import { Course } from '../add-timetable/timetable-select/timetable-select.page';

export interface Orar {
    [day: string]: OreZi
}

export interface OreZi {
    schedule: Course[];
}

export interface UserState {
    user: User | null;
    userDetails?: any;
    listaProfesori?: any[];
    listaStudenti?: any[];
    saptamanaImpara?: Orar | undefined,
    saptamanaPara?: any;
    semestrulCurent?: 'semestrul1' | 'semestrul2';
    saptamanaSelectata?: 'saptamanaPara' | 'saptamanaImpara';
    semestrulSelectat?: 'semestrul1' | 'semestrul2';
    filtreAdaugareOrar: {
        year?: string;
        specialization?: string;
        group?: string;
        subGroup?: string;
    };
    listaMaterii?: any[];
    materiaSelectata?: any;
    grupaSelectata?: string | null;
    subgrupaSelectata?: string | null;
    listaElementeCurs?: any[];
    elementCursSelectat?: any;
}

const initialState: UserState = {
    user: null,
    userDetails: null,
    listaProfesori: [],
    listaStudenti: [],
    saptamanaPara: null,
    saptamanaImpara: undefined,
    saptamanaSelectata: 'saptamanaImpara',
    semestrulCurent: 'semestrul1',
    semestrulSelectat: 'semestrul1',
    filtreAdaugareOrar: {},
    listaMaterii: [],
    materiaSelectata: null,
    grupaSelectata: null,
    subgrupaSelectata: null,
    listaElementeCurs: [],
    elementCursSelectat: null
};

@Injectable({
    providedIn: 'root'
})
export class StateManagerService {
    private stateSubject: BehaviorSubject<UserState> = new BehaviorSubject<UserState>(initialState);
    public state$ = this.stateSubject.asObservable();

    user$ = this.state$.pipe(
        map((state: UserState) => state.user)
    );
    userDetails$ = this.state$.pipe(
        map((state: UserState) => state.userDetails)
    );

    saptamanaImpara$ = this.state$.pipe(
        map((state: UserState) => state.saptamanaImpara)
    );

    saptamanaPara$ = this.state$.pipe(
        map((state: UserState) => state.saptamanaPara)
    );

    saptamanaSelectata$ = this.state$.pipe(
        map((state: UserState) => state.saptamanaSelectata)
    );

    listaProfesori$ = this.state$.pipe(
        map((state: UserState) => state.listaProfesori)
    );

    listaStudenti$ = this.state$.pipe(
        map((state: UserState) => state.listaStudenti)
    );

    semestrulCurent$ = this.state$.pipe(
        map((state: UserState) => state.semestrulCurent)
    );

    semestrulSelectat$ = this.state$.pipe(
        map((state: UserState) => state.semestrulSelectat)
    );

    filtreAdaugareOrar$ = this.state$.pipe(
        map((state: UserState) => state.filtreAdaugareOrar)
    );

    listaMaterii$ = this.state$.pipe(
        map((state: UserState) => state.listaMaterii)
    );

    materiaSelectata$ = this.state$.pipe(
        map((state: UserState) => state.materiaSelectata)
    );

    grupaSelectata$ = this.state$.pipe(
        map((state: UserState) => state.grupaSelectata)
    );

    subgrupaSelectata$ = this.state$.pipe(
        map((state: UserState) => state.subgrupaSelectata)
    );

    listaElementeCurs$ = this.state$.pipe(
        map((state: UserState) => state.listaElementeCurs)
    );

    elementCursSelectat$ = this.state$.pipe(
        map((state: UserState) => state.elementCursSelectat)
    );

    public updateState(value: any): void {
        this.stateSubject.next({...this.stateSubject.value, ...value});
    }

    public clearState(): void {
        this.stateSubject.next(initialState);
    }
}