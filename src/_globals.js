const logger = require('./logger');

const base_dir = __dirname;

const abs_path = function(path) {
  return base_dir + path;
}

const _include = function(file) {
    // console.log(file);
    const main = '/';
    const lib = 'libraries/';
    const comp = 'components/';

    let error;
    let path;

    try {
        return require(abs_path(main + file));
    } catch (err) {
        _logger.error(err.stack);
    }
}

// ASSIGN _include to global object
Object.defineProperty(global, '_include', {
    value: _include,
    writable: false,
    configurable: false
});

Object.defineProperty(global, '_logger', {
    value: logger,
    writable: false,
    configurable: false
});