export enum SubjectImportance
{
    normal = "normal",
    important = "important",
    urgent = "urgent"
}

export class Subject{
    propertyID: string;
    ownerID: string;
    renterID: string;
    title: string;
    description: string;
    // Modified field importance from string to SubjectImportance
    importance: SubjectImportance;
    id:string;
}