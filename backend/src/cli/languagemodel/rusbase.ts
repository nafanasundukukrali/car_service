import { injectable } from "tsyringe";
import ILanguageModel from "./ILanguageModel.inteface";
import { log } from 'console';

@injectable()
export default class RuBase implements ILanguageModel{
    askLogin = "Введите e-mail: ";
    askPassword = "Введите пароль: ";
    infoIncorrectData = "Не был найден пользователь с таким паролем и логином. Попробуйте ещё раз.";
    outEnterQuestion = "Хотите завершить попытку войти? (Да/Нет): ";
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
    askCarNick = 'Введите пользовательский ник: ';
    userFIO = 'ФИО: ';
    userEmail = 'e-mail: ';
    userType = 'Тип пользователя: ';
    userPhone = 'Телефон: ';
    userDatebirth = 'Дата рождения: ';
    userRoleClient = 'Клиент';
    userRoleAdmin = 'Администратор';
    userRoleMechanic = 'Механик';
    userRolePassword = 'Пароль: '
    userPasswordCapcha = '****************';
    askInputNumber = 'Выберете пункт меню:';
    carAdd = 'Добавить автомобиль';
    carUpdate = 'Изменить информацию об автомобиле';
    outAddCarQuestion = "Хотите завершить попытку добавления автомобиля? (Дa/Нет): ";
    tokenExpired = "Токен истёк. Войдите заново."
    inputIncorrect = "Данные введены некорректно."
    warningIgnore = "Предупреждение: нажмите enter, чтобы не изменять поле."
    inputCarNUmber = "Введите порядок номера автомобиля в таблице: "
    outUpdateCarQuestion = "Хотите завершить попытку обновления информации об автомобиле? (Дa/Нет): ";
    status = 'Статус';
    date = 'Дата';
    createdStatus = 'Заявка обрабатывается администратором'
    saved = 'Заявка назначена механику'
    dirty = 'Возникла ошибка в заявке'
    closed = 'Исполнена'
    noApplicationRecord = 'Нет заявок';
    inputDateBirth = 'Введите дату рождения: ';
    inputServiceNumber = "Введите номер услуги из таблицы: ";
    outCreateApplication = "Завершить заполнение заявки без её создания? (Да/Нет): ";

}