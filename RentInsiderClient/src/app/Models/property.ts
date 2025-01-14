export enum Partitioning
{
    detached, semidetached, nondetached
}

export class Property {
    title: string;
    price: number;
    type: string;
    county: string;
    city: string;
    address:string;
    surface: number;
    // Changed partitioning's type from string to Partitioning enum
    partitioning: Partitioning;
    water_consumption_index:number;
    floor:number;
    number_of_rooms:number;
    due_date: number;
    ownerID:string;
    renterID:string;
    id:string;
}
