import { CustomError } from "../error/CustomError";

export interface concertInputDTO {
    weekDay: string,
    startTime: number,
    endTime: number,
    bandId: string, 
}

export interface concertOutputDTO {
    bandName: string,
    musicGender: string
}

export class ConcertClass {
    constructor(
       private id: string,
       private weekDay: weekDay,
       private startTime: number,
       private endTime: number,
       private bandId: string
    ) {}

      public getId(): string {
        return this.id;
      }
    
      public getWeekDay(): weekDay {
        return this.weekDay;
      }
    
      public getStartTime(): number {
        return this.startTime;
      }
    
      public getEndTime(): number {
        return this.endTime;
      }
    
      public getBandId(): string {
        return this.bandId;
      }
}


export enum weekDay {
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export const stringToWeekDay = (input: string): weekDay => {
    switch (input.toUpperCase()) {
      case "FRIDAY":
        return weekDay.FRIDAY
      case "SATURDAY":
        return weekDay.SATURDAY
      case "SUNDAY":
        return weekDay.SUNDAY
      default:
        throw new CustomError(422, "Invalid week day")
    }
}