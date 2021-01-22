// importing the modules

const { Schema, model:Model } = require('mongoose');

const { isEmail } = require('validator');

const bcrypt = require('bcrypt');


const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin Must Have A Name!'],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      validate: [isEmail, 'Admin Must Have A alid Email Address!'],
      unique: [true, 'Email Address already exists!'],
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      trim: true,
      // select: false
    },
    createdAt: {
      type: Date,

      default: Date.now(),
    },
  },

  {
    toJSON: { virtuals: true, versionKey: false },

    toObject: { virtuals: true, versionKey: false },
  }
);

// indexing the doc for quick fetch

// adminSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'Admin Already Exists'] });

adminSchema.index({ slug: 1 });

// adminSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

adminSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
  
    next();
});

// ADMIN STATICS
adminSchema.statics.findByEmail = async function(email) {
  return await this.findOne({ email });
}

adminSchema.statics.registerAsAdmin = async function(email) {
    const maxAdmin = parseInt((await this.find().estimatedDocumentCount()));

    return (maxAdmin < 4) ? true : false
}

// ADMIN METHODS
adminSchema.methods.validPassword = async function(password) {
  console.log(password)
  return await bcrypt.compare(password, this.password);
}

const Admin = Model('Admin', adminSchema);


module.exports = Admin;
