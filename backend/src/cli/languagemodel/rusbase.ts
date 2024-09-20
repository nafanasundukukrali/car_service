import { injectable } from "tsyringe";
import ILanguageModel from "./ILanguageModel.inteface";
import { log } from 'console';

@injectable()
export default class RuBase implements ILanguageModel{
    askLogin = "Введите e-mail: ";
    askPassword = "Введите пароль: ";
    infoIncorrectData = "Не был найден пользователь с таким паролем и логином. Попробуйте ещё раз.";
    outEnterQuestion = "Хотите завершить попытку войти? (Да/Нет): ";
    askCarNickEmpty = "Вы ввели ник пустым. Вы действительно хотите удалить ник? (Да/Нет): ";
    askEmail = "Введите e-mail: ";
    askPhone = "Введите телефон (в формате 89009009090): ";
    askFio = "Введите ФИО: ";
    askPass = "Введите пароль: ";
    outRegQuestion = "Хотите завершить попытку заполнения поля? (Дa/Нет): ";
    noEmptyField = "Поле не может быть пустым.";
    yes = 'Да';
    important = '(поле обязательно для заполнения)'
    questionYear = 'Введите год: '
    questionMonth = 'Введите месяц: '
    questionDay = 'Введите день: '
    serviceName = 'Наименование услуги';
    serviceDiscription = 'Описание';
    servicePrice = 'Цена (в рублях)';
    carListEmpty = 'Нет информации об автомобилях!';
    carMark = 'Модель';
    carRun = 'Пробег';
    carColor = 'Цвет';
    carVIN = 'VIN';
    carYear = 'Год выпуска';
    carNick = 'Пользовательский Ник';
    carOwner = 'Владелец автомобиля';
    carOwnerID = 'ID владельца автомобиля';
    askCarMark = 'Введите марку автомобиля: ';
    askCarRun = 'Введите пробег: ';
    askCarColor = 'Введите цвет: ';

    askCarVIN = 'Введите VIN: ';
    askCarYear = 'Введите год выпуска: ';
    commentMechanic = 'Комментарий механика: ';
    askCarNick = 'Введите пользовательский ник: ';
    userFIO = 'ФИО: ';
    errorGetClientName = 'Ошибка: не удалось найти клиента, связаного с заявкой.';
    userEmail = 'e-mail: ';
    box = 'Бокс: ';
    errorGetMechanicAndSheduleInfo = 'Ошибка получения ифнормации о механике и боксе.';
    userType = 'Тип пользователя: ';
    userPhone = 'Телефон: ';
    userDatebirth = 'Дата рождения: ';
    userRoleClient = 'Клиент';
    userRoleAdmin = 'Администратор';
    userRoleMechanic = 'Механик';
    userRolePassword = 'Пароль: '
    userPasswordCapcha = '****************';
    askInputNumber = 'Выберете пункт меню:';
    askInputApplicationNumber = 'Введите номер заявки: ';
    carAdd = 'Добавить автомобиль';
    carUpdate = 'Изменить информацию об автомобиле';
    carExit = 'Завершить редактирование списка автомобилей клиента';
    outAddCarQuestion = "Хотите завершить попытку добавления автомобиля? (Дa/Нет): ";
    tokenExpired = "Токен истёк. Войдите заново."
    inputIncorrect = "Данные введены некорректно."
    warningIgnore = "Предупреждение: нажмите enter, чтобы не изменять поле."
    inputCarNUmber = "Введите порядок номера автомобиля в таблице: "
    outUpdateCarQuestion = "Хотите завершить попытку обновления информации об автомобиле? (Дa/Нет): ";
    errorApplicationIncorrect = '';
    status = 'Статус';
    date = 'Дата';
    service = 'Услуга: ';
    duration = 'Длительность: ';
    noDateInfo = 'НЕТ ИНФОРМАЦИИ О ДАТЕ';
    createdStatus = 'Заявка обрабатывается администратором'
    savedClient = 'Заявка назначена механику'
    dirty = 'Возникла ошибка в заявке'
    closed = 'Исполнена'
    noApplicationRecord = 'Нет заявок';
    inputDateBirth = 'Введите дату рождения: ';
    inputServiceNumber = "Введите номер услуги из таблицы: ";
    outCreateApplication = "Завершить заполнение заявки без её создания? (Да/Нет): ";
    adminClientMenu = `
    Выберете пункт из меню:
    0. Завершить работу с клиентами
    1. Посмотреть список клиентов
    2. Посмотреть профиль клиента по e-mail
    3. Посмотреть профиль клиента по номеру телефона
    4. Добавить клиента
    `;
    adminMechanicMenu = `
    Выберете пункт из меню:
    0. Завершить работу с механиками
    1. Посмотреть список механиков
    2. Посмотреть профиль механика по e-mail
    `;
    incorrectInput = 'Пункт выбран некорректно.';
    userColumnEmail = "e-mail";
    userColumnName = "ФИО";
    userColumnPhone = "Номер телефона";
    userColumnAskAction = `
    Выберите один пункт из меню:
    0. Завершить выводить список
    1. Вывести следующую страницу
    `;
    clientLastInTable = "Был выведен последний клиент";
    userGetInfoZero = "Пользователь не был найден";
    userGetInfoMoreTahnOne = "Было найдено несколько пользователей по данному запросу, невозможно открыть страницу.";
    seachEmailClient = "Введите адрес электронной почты пользователя";
    errorIncorrectEmail = "Некорректный адрес электронной почты."
    errorIncorrectPhone = "Некорректный номер телефона был введен";
    errorGetServiceName = "Ошибка: не удалось получить именование сервиса."
    userCarList = "Машины пользователя";
    clientMenuForAdmin = `
    Выбирите один пункт из меню:
    0. Вернуться в меню работы со списком клиентов;
    1. Вывести инффорацию о клиенте;
    2. Изменить информацию о клиенте;
    3. Изменить информацию о транспортах клиента;
    4. Работать с заявками клиента;
    `;
    askIfUserNeedDataInfo = "Информация нужна за конкретный период? (Да/Нет): ";
    mechanicMenuForAdmin = `
    Выберите один пункт из меню:
    0. Вернуться в меню работы со списком механиков;
    1. Вывести информацию о механике ещё раз;
    2. Изменить информацию о механике;
    3. Работать с графиком отпусков механика;
    5. Работать с заявками, связанными с механиком;
    `;
    no = "Нет";
    askMechanicStatus = `
    Выберите пункт из меню:
    0. Статус механика оставить тот же;
    1. Сделать учетную запись архивированной;
    2. Разархивировать учетную запись.
    `;
    applicationsMenuForAdmin = `
    Выберите пункт из меню:
    0. Завершить работу с заявками;
    1. Выбрать заявку по порядковому номеру;
    `
    applicationMenuForAdmin = `
    Выберите пункт из меню:
    0. Завершить работу с заявкой;
    1. Вывести ещё раз полную информацию по заявке;
    2. Работать с информацией о связанной с заявкой механике;
    3. Изменить заявку;
    `;
    userStatusField = "Статус:";
    userStatusStored = "Работает";
    userStatusArchived = "Архивирован";
    userStatusVocation = "В отпуске";
    userInVocationImpossibleChange = "Сотрудник в отпуске, нельзя изменить его статус, пока он не вернется из отпуска.";
    mehcanicLastInTable = "Выведен последний механик";
    inputStartDatePeriod = "Ввод даты начала периода.";
    inputEndDatePeriod = "Ввод даты конца приода.";
    errorStartEnd = "Дата начала периода позже конца периода"
    errorGetScheduleInfo = 'Не удалось получить информации о записи в расписании'
    errorGetMechanicInfo = 'Не удалось получить информацию о механике';
    errorGetCarInfo = 'Не удалось получить ифнормациюю о машине/машинах.'
    errorGetApplications = 'Не далось получить информацию о заявке/заявках.';
    errorCreateApplication = 'Не удалось создать заявку.'
    updateApplicationAdminMenu = `
    Выберите пункт из меню:
    0. Изменить или назначить дату и время заявки, услугу, механика;
    1. Изменить статус;
    `;
    statusMenu = `
    Выберите статус из меню:
    0. Заявка назначена механику;
    1. Исполнена.
    `;
    errorImpossibleChangeApplicationStatus: string;
    errorImpossibleUpdateApplication: string;
    errorImpossibleGetScheduleInfo: string;
    updateApplicationAdminMechanic: string;
    errorImpossibleUpdateMechanic: string;
    outUpdateApplication: string;
    askChangeStatus: string;
    wouldUpdateMechanic: string;
    savedMechanicSchedule: "Работает";
    dayWeek: "День недели";
    timeStart: "Время начала ";
    timeEnd: "Время конца ";
    archived: "Архивировано";
    dateStart = "Дата начала ";
    dateEnd = "Дата конца ";
    vocationMenuForAdmin = `
    Введите один из пунктов меню:
    0. Завершить работу над графиком отпусков;
    1. Вывести информацию о графике отпусков ещё раз;
    2. Удалить отпуск;
    3. Добавить отпуск;
    `
    errorDeleteVocation = 'Невозможно удалить отпуск'
    vocationDeleteAsk = 'Выберите номер строки из таблицы отпусков, которую нужно удалить: ';
    errorImpossibleCreateSameVocationPeriod = 'Невозможно создать отпуск на данный период.';
    mechanicApplicationMenu = `
    Введите один из пунктов меню:
    0. Завершить работу над заявкой;
    1. Добавить или изменить комментарий к заявке.
    `
    askInputComment = 'Введите новый комментарий к заявке: ';
    impossibleUpdateComment = 'Нельзя добавить комментарий к заявке.';
    impossibleWorkWithApplication = 'Возникла ошибка при работе с данной заявкой.'
}