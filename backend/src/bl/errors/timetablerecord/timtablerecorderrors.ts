export enum errorImpossibleCreateTimeTableRecord {
    noStartDate = 'there is no info about start date and time',
    theEndDateIsNextDay = 'the date of end is not same as the start date',
    existingRecord = 'same timetable record existing',
    durationMoreShedularEnd = 'duration of service more than mechanic worktime',
    sameRecords = 'dame time records in one shedular period',
    notSameDayweek = 'week of day not same in schedular and time record'
}

export enum errorImpossibleUpdateRecord {
    noSheduleInfo = 'the is no info for check (shedule)'
}