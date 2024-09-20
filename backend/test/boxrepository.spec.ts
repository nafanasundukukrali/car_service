import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { BoxRepositoryName } from '@asinterfaces/repository/interfacesnames';
import { DAInjectionReg } from '@da/dainjection';
import { IBoxRepository } from '@asinterfaces/repository/IBoxRepository,interface';
import { BoxInfo } from '@astypes/boxinfo/boxinfo';

new DAInjectionReg();
const box: IBoxRepository = container.resolve(BoxRepositoryName);

describe('box repository', () => {
    it('search', async () => {
        let res: BoxInfo[] = await box.search({number: 1});
        assert.isOk(res.length == 1 && res[0].number == 1);
    });

    it('validate get list of all', async () => {
        let res = await box.getListOfAll(0, 2);
    
        assert.isOk(res.length == 2);
    });
});