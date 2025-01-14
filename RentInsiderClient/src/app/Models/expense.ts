import { DocumentReference } from "@angular/fire/firestore";
import {Duration} from '../Models/duration'

export enum ServiceExpenses
{
    water="water",
    gas="gas",
    electricity="electricity",
    rent="rent",
    internet="internet",
}

export class Expense {
    due:boolean
    consumed:string;
    date_of_submition:string
    pdf:string;
    duration:Duration;
    // Since the expense might have a custom service, service can accept now both string and ServiceExpenses
    service: ServiceExpenses | string;
    sum:number;
    type:string;
    propertyID:string;
    id:string;
}
