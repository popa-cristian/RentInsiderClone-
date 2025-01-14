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

// // this list corresponds to the predefined keys present in the database
// // if the user chooses to add a custom supplier, that name will be used as a key (not modular at all...)
// // we need this list of keys to check if the key is indeed a predefined one or a custom one, 
// // and display the name of the service accordingly (predefined, or custom name)
// export const expenseTypes = ['Apa', 'Gaz', 'En electrica', 'Cablu/Internet']
