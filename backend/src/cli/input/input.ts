import readline from 'readline';
import ILanguageModel from '../languagemodel/ILanguageModel.inteface';
import { container } from 'tsyringe';
import { LanguageModel } from '../depencecli';

export default class Input {
    _lm: ILanguageModel;

    constructor () {
        this._lm = container.resolve(LanguageModel);
    }

    async askQuestion(query: string): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    
        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }))
    }

    async wait_until_input(question: string, askout: string)
    {
        while (true)
        {
            let res = await this.askQuestion(question)
            
            if (res == "" || res == '\n')
                console.log(this._lm.noEmptyField);
            else
                return res;

            let out = await this.askQuestion(askout)
            if (out === this._lm.yes)
                return;
        }
    }

    async wait_input_positive_integer(question: string, askout: string)
    {
        while (true)
        {
            let res = await this.askQuestion(question)
            if (res == "" || res == '\n' || !Number.isInteger(Number(res)) || Number(res) <= 0)
                console.log(this._lm.inputIncorrect);
            else
                return Number(res)

            let out = await this.askQuestion(askout)
            if (out === this._lm.yes)
                return;
        }
    }

    async date_input(askout: string)
    {
        while (true)
        {
            let year = await this.askQuestion(this._lm.questionYear)
            let month = await this.askQuestion(this._lm.questionMonth)
            let day = await this.askQuestion(this._lm.questionDay)
            
            if (year == "" || year == '\n' || month == "" || month == '\n' || day == "" || day == '\n')
                console.log(this._lm.noEmptyField);
            else if (!Number.isInteger(Number(year)) || !Number.isInteger(Number(month)) || !Number.isInteger(Number(day)) || 
                    Number(year) <= 0 || Number(month) <= 0 || Number(day) <= 0)
                console.log(this._lm.inputIncorrect);
            else
            {
                try {
                    let date = new Date();
                    date.setUTCFullYear(Number(year), Number(month) - 1, Number(day));
                    return date;
                }
                catch (e)
                {
                    console.log(this._lm.inputIncorrect)
                }

                let out = await this.askQuestion(askout)
                if (out === this._lm.yes)
                    return;
            }

            let out = await this.askQuestion(askout)
                if (out === this._lm.yes)
                    return;
        }
    }
}