/*
|--------------------------------------------------------------------------
| CORE vuex getters
|--------------------------------------------------------------------------
|
*/
export default {
  core (state, config) { // mTypeNamePl, mTypeName
    return {
      ['all' + config.options.nameVuex]: state => state.all,
      ['allByParent' + config.options.nameVuex]: state => state.allByParent,
      [config.options.nameSingleVuex]: state => state.item,
      ['clone' + config.options.nameSingleVuex]: state => state.clone
    }
  }
}
