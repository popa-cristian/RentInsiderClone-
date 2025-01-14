import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Property } from '../../Models/property';
import { Renter } from '../../Models/renter';
import { RenterComponent } from '../renter/renter.component';
import { PropertyService } from '../../Services/propertyService/property.service';
import { RenterDBService } from '../../Services/renterDbService/renter-db.service';

@Component({
  selector: 'app-info-renter',
  templateUrl: './info-renter.component.html',
  styleUrls: ['./info-renter.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InfoRenterComponent implements OnInit {
  public modalRef: BsModalRef;
  @Input() item: Renter;
  constructor(
    private modalService: BsModalService,
    public renterdb: RenterDBService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RenterComponent>,
    public propertyService: PropertyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
