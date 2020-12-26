// importing the modules

const mongoose = require('mongoose');

// import mongoSanitize from 'express-mongo-sanitize';

const slugify = require('slugify');

// import validator from 'validator';

const { default: ShortUniqueId } = require('short-unique-id');

const { states, OriginAudit } = require('../../libraries/shared/helpers');

const { states: lgas } = require('../../libraries/shared/json');

const userSchema = new mongoose.Schema(
  {
    christainName: {
      type: String,
      required: [true, 'Participant Must Have A christainName'],
      trim: true,
      lowercase: true,
      // set: (el) => el.toLowerCase(),
    },

    firstName: {
      type: String,

      required: [true, 'Participant Must Have A Firstname'],
      trim: true,
      lowercase: true,
      // set: (el) => el.toLowerCase(),
    },

    middleName: {
      type: String,
      trim: true,
      lowercase: true,
      // set: (el) => el.toLowerCase(),
    },

    lastName: {
      type: String,
      required: [true, 'Participant Must Have A Lastname'],
      // set: (el) => el.toLowerCase(),
    },
    DOB: {
      type: Date,
      required: [true, 'All Participants Must HAve A Date Of Birth'],
    },
    POB: {
      type: String,
      lowercase: true,
      required: [true, 'Place Of Birth Cannot Be Empty'],
    },
    ordained: {
      type: Boolean,
      default: false,
    },
    parentsOrGuardian: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          cast: '{VALUE} is not a valid id',
        },
      ],

      validate: {
        validator: (el) => {
          return el.length <= 2;
        },

        message: 'Max Number Of Parents is Two (2)',
      },
    },

    baptism: {
      type: mongoose.Schema.ObjectId,
      ref: 'Baptism',
      unique: true,
    },
    communion: {
      type: mongoose.Schema.ObjectId,
      ref: 'Communion',
      unique: true,
    },
    confirmation: {
      type: mongoose.Schema.ObjectId,
      ref: 'Confirmation',
      unique: true,
    },
    marriage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Marriage',
    },
    death: {
      type: mongoose.Schema.ObjectId,
      // ref: 'Death',
    },

    stateOfOrigin: {
      type: String,

      set: (el) => el.toLowerCase(),

      required: [true, 'Every Participant Must Have A State Of Origin'],

      validate: {
        validator() {
          return states(this.stateOfOrigin);
        },

        message: 'Invalid State , Select A State In Nigeria',
      },
    },
    lga: {
      type: String,
      lowercase: true,
      required: [true, 'Every Participant Must HAve A Local Goverment Area'],
      validate: {
        validator(lga) {
          const state = this.stateOfOrigin;

          return OriginAudit(lgas, lga, state);
        },

        message: 'LGA Cannot Be Found In the Specified State',
      },
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ['male', 'female'],

        message: 'Gender Can Only Be Either Male Or Female',
      },

      required: [true, 'Every Participant Must Have A Gender'],

      trim: true,
    },

    active: {
      type: Boolean,

      dafault: true,
    },

    alive: {
      type: Boolean,

      dafault: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'Unique SACRAMENT ID Belongs To An Existing User'],
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      // ref: Staff,
      // required: [true, 'Every Document Must Have A Creator'],
    },

    createdAt: {
      type: Date,

      default: Date.now(),
    },
  },

  {
    toJSON: { virtuals: true, versionKey: false, id: true },

    toObject: { virtuals: true, versionKey: false, id: true },
  }
);

// indexing the doc for quick fetch

// userSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'User Already Exists'] });

userSchema.index({ slug: 1 });

// userSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

userSchema.pre('save', function (next) {
  const uniqueId = new ShortUniqueId();

  const slug = `${this.christainName}-${this.lastName}-${uniqueId()}`;

  this.slug = slugify(slug, { lower: true });

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
