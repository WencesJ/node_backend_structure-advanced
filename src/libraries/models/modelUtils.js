const crypto = require('crypto');

const removeProps = (props) => {
  return (doc, ret) => {
    if (Array.isArray(props)) {
      props.forEach((prop) => delete ret[prop]);
    }

    delete ret.id;
    delete ret.createdAt;
    delete ret.__v;

    return ret;
  };
};

exports.customProps = (props) => {
  return {
    virtuals: true,
    versionKey: false,
    transform: removeProps(props),
  };
};


exports.arrayLimit = (minLimit, maxLimit, val) => {
  return val.length > minLimit && val.length < maxLimit;
};


exports.toLowerCaseObject = (value) => {
  if (!Array.isArray(value) && typeof value !== 'object') {
    return undefined;
  }

  if (!Array.isArray(value) && typeof value === 'object') {
    value = Object.values(value);
    console.log('isObject', value);
  }

  console.log(value, typeof value);

  value = value.map((val) => val.toLowerCase());
  return value;
};

exports.encryptId = (id) =>
  crypto.createHash('sha256').update(id).digest('hex');

