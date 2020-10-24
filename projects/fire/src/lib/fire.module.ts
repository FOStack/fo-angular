import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FireComponent } from './fire.component';

import * as auth from 'firebase/app';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire';


@NgModule({
  declarations: [FireComponent],
  imports: [
    AngularFireAuthModule, 
    AngularFirestoreModule,
  ],
  exports: [FireComponent]
})
export class FireModule {
  constructor(@Optional() @SkipSelf() parentModule?: FireModule) {
    if (parentModule) {
      throw new Error(
        'FireModule is already loaded. Import it in the AppModule only');
    }
  }

  public static forRoot(config:any): ModuleWithProviders<AngularFireModule> {
    return {
      ngModule: AngularFireModule,
      providers: [
        { provide: FIREBASE_OPTIONS, useValue: config }
      ]
    }
  }
}
