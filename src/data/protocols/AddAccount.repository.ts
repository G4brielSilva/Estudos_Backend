import { AddAccountModel } from '../../domain/usecases/AddAccount';
import { AccountModel } from '../../domain/models/Account.models';

export interface AddAccountRepository {
    add (accountData: AddAccountModel): Promise<AccountModel>
}