let compEmitter = require('./compEmitter');

const userEvents = _include('components/users/suscriber');
const adminEvents = _include('components/admin/suscriber');


const compose = (fn1, ...fns) => (emitter) => fn1(fns.reduce((returnedData, currentFn) => currentFn(returnedData), emitter));

compEmitter = compose(userEvents, adminEvents)(compEmitter);

module.exports = compEmitter;
