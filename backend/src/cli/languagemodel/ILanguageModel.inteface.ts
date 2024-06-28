export default interface ILanguageModel
{
    askLogin: string,
    askPassword: string,
    infoIncorrectData: string,
    outEnterQuestion: string,
    askEmail: string,
    askPhone: string,
    askFio: string, 
    askPass: string,
    outRegQuestion: string,
    noEmptyField: string,
    yes: string,
    important: string,
    questionYear: string
    questionMonth: string
    questionDay: string,
    serviceName: string,
    serviceDiscription: string,
    servicePrice: string,
    carListEmpty: string
    carMark: string,
    carRun: string,
    carColor: string,
    carVIN: string,
    carYear: string,
    carNick: string,
    carOwner: string,
    carOwnerID: string,
    askCarMark: string,
    askCarRun: string,
    askCarColor: string,
    askCarVIN: string,
    askCarYear: string,
    askCarNick: string
    userFIO: string,
    userEmail: string,
    userType: string,
    userPhone: string,
    userDatebirth: string,
    userRoleClient: string,
    userRoleAdmin: string,
    userRoleMechanic: string,
    userRolePassword: string,
    userPasswordCapcha: string,
    carAdd: string;
    carUpdate: string;
    askInputNumber: string;
    outAddCarQuestion: string;
    tokenExpired: string;
    inputIncorrect: string;
    inputCarNUmber: string;
    outUpdateCarQuestion: string;
    status: string;
    date: string;
    createdStatus: string;
    saved: string;
    dirty: string;
    closed: string;
    noApplicationRecord: string;
    inputDateBirth: string;
    inputServiceNumber: string;
    outCreateApplication: string;
    warningIgnore: string;
}