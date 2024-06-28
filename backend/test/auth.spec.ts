import { container } from "tsyringe";
import { expect } from 'chai';
import 'mocha';
import Auth from "@blrealization/auth/auth";
import { Id } from "@bltypes/id/id";
import { AuthError } from "@blerrors/auth/autherrors";

describe('login', () => {
    it ('not password', async () => {
        const cln = new Auth();
        let buf: Id = new Id('1');
        const token = await cln.login({id: buf}, '111')
            .catch((error) => expect(error.message).is.equal(AuthError.noUserPass))
      });

    it ('not same passwords', async () => {
        const cln = new Auth();
        let buf: Id = new Id('1');
        const token = await cln.login({id: buf, password: '112'}, '111')
            .catch((error) => expect(error.message).is.equal(AuthError.incorrectPass))
      });

    it ('correct login', async () => {
      const cln = new Auth();
      let buf: Id = new Id('1');
      let user = {id: buf, password: '111'}
      let user1 = {id: buf, password: '111'}
      await cln.hashPassword(user1)
      const token = await cln.login(user, user1.password);
      const res = cln.verifyToken(token);
      expect(res).is.true;
    });
  }
);

describe('verifyToken', () => {
    it ('incorrect token', async () => {
      const cln = new Auth();
      let buf: Id = new Id('1');
      let user = {id: buf, password: '111'}
      let user1 = {id: buf, password: '111'}
      await cln.hashPassword(user1)
      const token = await cln.login(user, user1.password);
      const res = cln.verifyToken(token, 'incor token');
      expect(res).is.false;
    });
  }
);