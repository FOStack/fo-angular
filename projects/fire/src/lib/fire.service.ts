import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor() { }
}










@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth
  ) { }

  public async result() {
    return await this.auth.getRedirectResult()
  }

  public user$ = this.auth.user;

  public async user() {
    return await this.user$.toPromise()
  }

  public state$ = this.auth.authState;

  public async state() {
    return await this.state$.toPromise()
  }

  public async init() {
    await this.login();
    return await this.user()
  }

  async login(provider?, method?) {
    await this.persist();
    if(!provider) provider = 'GoogleAuthProvider';
    method =(method)?method.replace(/^\w/, c => c.toUpperCase()):'Redirect';
    return await this.auth['signInWith'+method](
      new auth[provider]()
    )
  }

  public async logout() {
    try {
      await this.auth.signOut();
    } catch (e) {
      console.log(e);
    }
  }

  async emailPass(e,p) {
    await this.persist();
    return await this.auth.signInWithEmailAndPassword(e,p)
  }

  async register(e,p) {
    await this.persist();
    return await this.auth.createUserWithEmailAndPassword(e,p)
  }

  async persist(){
    return this.auth.setPersistence(auth.Auth.Persistence.LOCAL)
  }

}









@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private db: AngularFirestore
  ) { }

  public doc$ (p: any, id?: string) {
    return this.db.collection(p.c||p.col||p).doc(p.i||p.id||id);
  }

  public async doc (p: any, id?: string) {
    const ref = (id)?this.doc$(p, id):this.doc$(p);
    return await ref.valueChanges().toPromise();
  }

  public async set (p: any, id?: string, data?: any) {
    return await this.db.collection(p.c||p.col||p.collection||p).doc(p.id||p.doc||p.ref||id).set(p.data||p.s||p.set||data)
  }

  public async update (p: any, id?: string, data?: any) {
    return await this.db.collection(p.c||p.col||p.collection||p).doc(p.id||p.doc||p.ref||id).update(p.data||p.u||p.udpate||data)
  }

  public async add (p: any, data?: any) {
    return await this.db.collection(p.c||p.col||p.collection||p).add(p.data||p.set||data)
  }

  public ref (p: any) {
    return this.db.collection(p.c||p.col||p.collection||p, ref => {
      let query: any = ref;
      const w = p.w||p.where;
      if(!w) return query;

      if(Array.isArray(w)){
        w.forEach(e => {
          query = query.where(e.n||e.node||e.where||e.w, e.op||e.o||'==', e.q||e.query)
        });
      } else {
        query = query.where(p.where||p.w, p.op||p.o||'==', p.q||p.query)
      }

      return query
    })
  }

  public valueChanges$ (p: any) {
    const ref = this.ref(p);
    return ref.valueChanges({idField: p.key||'id'});
  }
  
  valueSwitch$ (p: any, q: any) {
    return q.pipe(
      switchMap(query => { 
        p.q = query;
        return this.valueChanges$(p); 
      })
    )
  }

}

