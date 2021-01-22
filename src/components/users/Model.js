// importing the modules

const { Schema, model:Model } = require('mongoose');

const slugify = require('slugify');

const { isEmail } = require('validator');

const bcrypt = require('bcrypt');

const { default: ShortUniqueId } = require('short-unique-id');

const { states, OriginAudit } = _include('libraries/shared/helpers');

// const { states: lgas } = _include('libraries/shared/json');

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'User Must Have A First Name!'],
      trim: true,
      lowercase: true,
    },

    middleName: {
      type: String,
      trim: true,
      lowercase: true
    },

    lastName: {
      type: String,
      required: [true, 'User Must Have A Last Name!'],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      validate: [isEmail, 'User Must Have A alid Email Address!'],
      unique: [true, 'Email Address already exists!'],
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      trim: true,
      // select: false
    },

    passwordConfirm: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(value) {
          return this.password === value
        },
        message: 'Passwords Do Not Match. Try Again!'
      }
    },

    dob: {
      type: Date,
      required: [true, 'User Must Have A Date Of Birth.'],
    },

    stateOfOrigin: {
      type: String,
      required: [true, 'Every User Must Have A State Of Origin.'],
      enum: {
        values: states,
        message: 'Invalid State, Select A State In Nigeria.',
      },
      lowercase: true
    },

    stateOfResidence: {
      type: String,
      required: [true, 'Every User Must Have A State Of Residence.'],
      enum: {
        values: states,
        message: 'Invalid State, Select A State In Nigeria.',
      },
      lowercase: true
    },

    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ['male', 'female'],
        message: 'Gender Can Only Be Either Male Or Female.',
      },
      required: [true, 'Every User Must Have A Gender.'],
      trim: true,
    },

    phone: {
      type: String,
      lowercase: true,
      required: [true, 'Every User Must Have A Valid Phone Number!']
    },

    active: {
      type: Boolean,
      dafault: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'User already exists!'],
    },

    verified: {
      type: Boolean,
      default: false
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

// userSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'User Already Exists'] });

userSchema.index({ slug: 1 });

// userSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const uniqueId = new ShortUniqueId();

    this.userNo = parseInt(await Model('User').find().estimatedDocumentCount()) + 1;
  
    const slug = `${this.firstName}-${this.lastName}-${this.userNo}-${uniqueId()}`;
  
    this.slug = slugify(slug, { lower: true });

    this.password = await bcrypt.hash(this.password, 12);
  
    this.passwordConfirm = undefined;
  }


  next();
});
userSchema.pre('save', async function (next) {

  if (!this.isModified('password') || this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

// USER STATICS
userSchema.statics.findByEmail = async function(email) {
  return await this.findOne({ email });
}

userSchema.statics.findBySlug = async function(slug) {
  return await this.findOne({ slug });
}

// USER METHODS
userSchema.methods.validPassword = async function(password) {
  console.log(password)
  return await bcrypt.compare(password, this.password);
}

const User = Model('User', userSchema);


module.exports = User;
