const EventEmitter = require('events');

class CompEmitter extends EventEmitter {
    emitEvent(event, data) {
        this.emit(event, data);
    }
}

const compEmitter = new CompEmitter();

module.exports = compEmitter;