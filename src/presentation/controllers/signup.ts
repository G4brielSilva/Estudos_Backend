import { MissingParamError } from '../errors/missing_param_error';
import { type HttpResponse, type HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http_helper';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    }
    if (!httpRequest.body.email) {
        return badRequest(new MissingParamError('email'));
    }

    return {
        statusCode: 0,
        body: new Error()
    };
  }
}