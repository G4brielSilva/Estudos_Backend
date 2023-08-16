import { EmailValidator } from '../presentation/protocols/EmailValidator';

export class EmailValidatorAdapter implements EmailValidator {
    public isValid (email: string): boolean {
        return false;
    }
}