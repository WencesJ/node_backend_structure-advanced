/**
 * @param {state} List A collesction of states in Nigeria
 *
 */

exports.states = (state) => {
  const statesBucket = [
    'abia',
    'adamawa',
    'akwa Ibom',
    'anambra',
    'bauchi',
    'bayelsa',
    'benue',
    'borno',
    'cross River',
    'delta',
    'ebonyi',
    'edo',
    'ekiti',
    'enugu',
    'gombe',
    'imo',
    'jigawa',
    'kaduna',
    'kano',
    'katsina',
    'kebbi',
    'kogi',
    'kwara',
    'lagos',
    'nasarawa',
    'niger',
    'ogun',
    'ondo',
    'osun',
    'oyo',
    'plateau',
    'rivers',
    'sokoto',
    'taraba',
    'yobe',
    'zamfara',
    'fCT',
  ];

  return statesBucket.includes(state.toLowerCase());
};

/**
 * @param lgas = List of Local Goverment Areas
 *
 * @param lga = Local Goverment Area inserted by the user
 *
 * @param state = state selected by the user
 *
 */

exports.OriginAudit = (lgas, lga, state) => {
  const check = lgas.some((el) =>
    // TODO: Replace the map with regular expression
    el.state.toLowerCase() === state.toLowerCase() ? el.lgas.map((val) => val.toLowerCase()).includes(lga) : false
  );

  return check;
};
