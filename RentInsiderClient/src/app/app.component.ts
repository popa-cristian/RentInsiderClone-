import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { translate } from '@angular/localize/src/utils';
import { TranslateService } from '@ngx-translate/core';
import { TransitionCheckState } from '@angular/material/checkbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'RentInsiderClient';
  items: Observable<any[]>;
  constructor(
    firestore: AngularFirestore,
    private translateService: TranslateService
  ) {
    this.items = firestore.collection('Owners').valueChanges();
    translateService.addLangs(['en', 'ro']);
    translateService.setDefaultLang('ro');
    translateService.use(translateService.defaultLang);
  }
}
