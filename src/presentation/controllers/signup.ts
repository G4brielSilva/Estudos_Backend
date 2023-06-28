import { MissingParamError } from '../errors/missing_param_error';
import { type HttpResponse, type HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http_helper';

export class SignUpController {
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