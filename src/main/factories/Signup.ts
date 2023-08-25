import { SignUpController } from '../../presentation/controllers/signup/signup.controller';
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter';
import { DbAddAccount } from '../../data/usecases/addAccount/DbAddAccount';
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter';
import { AccountMongoRepository } from '../../infra/criptography/db/mongoDb/accountRepository/Account.repository';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/Log';

export const makeSignupController = (): Controller => {
    const bcryptAdapter = new BcryptAdapter(16);
    const accountMongoRepository = new AccountMongoRepository('accounts');

    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
    const emailValidatorAdapter = new EmailValidatorAdapter();

    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount);
    return new LogControllerDecorator(signUpController);
};
