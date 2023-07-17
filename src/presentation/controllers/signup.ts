import { MissingParamError } from '../errors/MissingParamError';
import { type HttpResponse, type HttpRequest } from '../protocols/Http';
import { badRequest } from '../helpers/httpHelper';
import { Controller } from '../protocols/Controller';
import { EmailValidator } from '../protocols/EmailValidator';
import { InvalidParamError } from '../errors/InvalidParamError';
import { ServerError } from '../errors/ServerError';

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }

            const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

            if (!isValidEmail) {
                return badRequest(new InvalidParamError('email'));
            }

            return {
                statusCode: 0,
                body: new Error()
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: new ServerError()
            };
        }
    }
}