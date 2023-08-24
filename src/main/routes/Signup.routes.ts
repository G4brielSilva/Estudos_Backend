import { Router } from 'express';
import { makeSignupController } from '../factories/Signup';
import { adaptRoute } from '../adapter/ExpressRouteAdapter';

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignupController()));
};
