export enum errorVocationPlane {
    userInVocationInThisPeriod = "your vocation period is wrong, there is another vocation period in this time",
    startDateOlderEnd = "start date of the vocation older than end date",
    todayIsVocationDay = "Impossible create vocation, because today can't be vocation"
}

export enum errorVocationDrop {
    userInVocation = "in selected period use is in vocation"
}

export enum errorVocationExisting {
    vocationNotExists = "vocation not exists"
}