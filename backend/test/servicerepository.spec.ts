import { expect, assert } from 'chai';
import 'mocha';
import { container } from 'tsyringe';
import { BoxRepositoryName, ServiceRepositoryName } from '@blinterfaces/repository/interfacesnames';
import { DAInjectionReg } from '@da/dainjection';
import { IBoxRepository } from '@blinterfaces/repository/IBoxRepository,interface';
import { ServiceInfo } from '@bltypes/serviceinfo/serviceinfo';
import { IServiceRepository } from '@blinterfaces/repository/IServiceRepository.interface';

new DAInjectionReg();
const service: IServiceRepository = container.resolve(ServiceRepositoryName);

describe('service repository', () => {
    it('search', async () => {
        let res: ServiceInfo[] = await service.search({name: 'Замена шин'});
        assert.isOk(res.length == 1);
    });

    it('validate get list of all', async () => {
        let res = await service.getListOfAll(0, 2);
    
        assert.isOk(res.length == 2);
    });
});