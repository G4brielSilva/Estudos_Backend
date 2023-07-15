import { MissingParamError } from '../errors/missingParamError';
import { type HttpResponse, type HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/httpHelper';
import { Controller } from '../protocols/controller';

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
            return badRequest(new MissingParamError(field));
        }
    }

    return {
        statusCode: 0,
        body: new Error()
    };
  }
}