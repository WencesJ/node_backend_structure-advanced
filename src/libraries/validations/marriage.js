const { AppError } = require('../../libraries/error');

const { STATUS } = require('../../libraries/shared/constants');

exports.validatMarriage = async (next, schema, Model) => {
  if (schema.isNew) {
    // bride document
    const bride = await Model.findById(schema.couple.bride).lean();

    // groom document
    const groom = await Model.findById(schema.couple.groom).lean();

    // witnesses couple document
    const witnessBride = await Model.findById(schema.witnesses.bride).lean();
    const witenessGroom = await Model.findById(schema.witnesses.groom).lean();

    // checking if couple document exists
    if (!bride) return next(new AppError('Bride Not Found in Records', STATUS.NOT_FOUND));

    if (!groom) return next(new AppError('Groom Not Found in Records', STATUS.NOT_FOUND));

    // checking if any of the couple has been previously married
    if (bride.marriage) return next(new AppError("Bride Has A Marriage Record That Hasn't Been Annulled"));

    if (bride.marriage) return next(new AppError("Groom Has A Marriage Record That Hasn't Been Annulled"));

    // checking if the witnesses couple document exists
    if (!witnessBride) return next(new AppError('Witness Bride Not Found in Records', STATUS.NOT_FOUND));

    if (!witenessGroom) return next(new AppError('Witness Groom Not Found in Records', STATUS.NOT_FOUND));

    // preventing same sex marriage
    if (bride.gender === groom.gender)
      return next(new AppError('Catholic Church Does Not Permit Same Sex Marriage', STATUS.NOT_FOUND));

    // ensuring bride and gromm has corresponding gender
    if (bride.gender !== 'female' || groom.gender !== 'male')
      return next(new AppError('Bride Must Be A Female And Groom A Male', STATUS.NOT_FOUND));

    // TODO: Make constant file for missing sacraments
    // TODO: Make sure all the sponsors has completed their sacamental rites

    const brideMessage = 'Bride Has Not Completed Sacramental Rites';

    const groomMessage = 'Groom Has Not Completed Sacramental Rites';

    // couple sacrament completion check

    const brideConfirmation = bride.confirmation;

    const groomConfirmation = groom.confirmation;

    if (!brideConfirmation) {
      return next(new AppError(brideMessage, STATUS.NOT_FOUND));
    }

    if (!groomConfirmation) {
      return next(new AppError(groomMessage, STATUS.NOT_FOUND));
    }
  }

  return next();
};
