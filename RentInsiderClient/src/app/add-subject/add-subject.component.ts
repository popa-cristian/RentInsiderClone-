import { Component, Inject, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Property } from '../Models/property';
import { Subject, SubjectImportance } from '../Models/subject';
import { SubjectsService } from '../Services/subjectService/subjects.service';
import { importanceLevelValidator } from './Utils/importance-level-validator.validator';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddSubjectComponent implements OnInit {
  Add_New_Subject_Form: FormGroup;
  Importance_Level_Form_Group: FormGroup;
  submitted = false;
  subject: Subject;
  currentProperty: Property;
  selectedSubject: Subject;

  constructor(
    private formBuilder: FormBuilder,
    private subjectService: SubjectsService,
    public dialog: MatDialog,
    public dialogReference: MatDialogRef<AddSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.subject === undefined) {
      this.selectedSubject = {
        title: '',
        importance: null,
        description: '',
        propertyID: '',
        ownerID: '',
        renterID: '',
        id: '',
      };
    } else {
      this.selectedSubject = data.subject;
    }
  }
  addSubject(): void {
    this.submitted = true;
    if (
      this.Add_New_Subject_Form.invalid ||
      this.Importance_Level_Form_Group.invalid
    ) {
      return;
    } else {
      const subjectToBeAdded = new Subject();
      const importanceLevel: SubjectImportance = this.getImportanceLevelValue();
      subjectToBeAdded.title =
        this.Add_New_Subject_Form.controls['subjectTitle'].value;
      subjectToBeAdded.importance = importanceLevel;
      subjectToBeAdded.description =
        this.Add_New_Subject_Form.controls['description'].value;
      subjectToBeAdded.propertyID = this.currentProperty.id;
      subjectToBeAdded.ownerID = this.currentProperty.ownerID;
      subjectToBeAdded.renterID = this.currentProperty.renterID;
      this.subjectService.addSubject(subjectToBeAdded);
      this.dialogReference.close();
    }
  }

  closeModal(): void {
    this.dialogReference.close();
  }

  ngOnInit(): void {
    this.currentProperty = this.data.currentProperty;
    this.initializeFormGroup(this.selectedSubject);
  }

  getImportanceLevelValue(): SubjectImportance {
    if (this.Importance_Level_Form_Group.value.normalCheckbox === true) {
      return SubjectImportance.normal;
    } else {
      if (this.Importance_Level_Form_Group.value.importantCheckbox === true) {
        return SubjectImportance.important;
      } else {
        return SubjectImportance.urgent;
      }
    }
  }

  get getForm() {
    return this.Add_New_Subject_Form.controls;
  }

  get getSecondForm() {
    return this.Importance_Level_Form_Group.controls;
  }

  initializeFormGroup(subject: Subject): void {
    (this.Add_New_Subject_Form = this.formBuilder.group({
      subjectTitle: [subject.title, Validators.required],
      description: [subject.description, Validators.required],
    })),
      (this.Importance_Level_Form_Group = this.formBuilder.group(
        {
          normalCheckbox: new FormControl(false),
          importantCheckbox: new FormControl(false),
          alertCheckbox: new FormControl(false),
        },
        { validators: [importanceLevelValidator()] }
      ));
  }
}
