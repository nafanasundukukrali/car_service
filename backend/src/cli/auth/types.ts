export enum userInfoMessages {
    askLogin = "Введите e-mail: ",
    askPassword = "Введите пароль: ",
    infoIncorrectData = "Не был найден пользователь с таким паролем и логином. Попробуйте ещё раз.",
    outEnterQuestion = "Хотите завершить попытку войти? (Д/Н): ",
    askEmail = "Введите e-mail: ",
    askPhone = "Введите телефон (в формате 89009009090): ",
    askFio = "Введите ФИО: ",
    askPass = "Введите пароль: ",
    outRegQuestion = "Хотите завершить попытку регистрации? (Д/Н): ",
    noEmptyField = "Поле не может быть пустым.",
    noEmptyFields = "Поля не могут быть пустыми.",
    yes = 'Да',
    important = '(поле обязательно для заполнения)'
}

export type returnAuthData = {
    user: any,
    token: any
}