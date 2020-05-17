/*
|--------------------------------------------------------------------------
| Import core
|--------------------------------------------------------------------------
|
*/
import Vue from 'vue'

/*
|--------------------------------------------------------------------------
| CORE vuex actions
|--------------------------------------------------------------------------
|
*/
export default {
  core (config) { //mTypeNamePl, mTypeName, dataUrl, displayName
    var self = this
    return {
      ['getAll' + config.options.name] ({ commit }) {
        return self.getBaseAll(commit, config)
      },
      ['getByParent' + config.options.name] ({ commit }, id_parent) {
        return self.getByParent(commit, config, id_parent)
      },
      ['get' + config.options.nameSingle] ({ commit }, id) {
        return self.getItem(commit, config, id)
      },
      ['update' + config.options.nameSingle] ({ commit }, item) {
        return self.updateItem(commit, config, item)
      },
      ['save' + config.options.nameSingle] ({ commit }, item) {
        return self.saveItem(commit, config, item)
      },
      ['delete' + config.options.nameSingle] ({ commit }, item) {
        return self.deleteItem(commit, config, item)
      },
      ['deleteByParent' + config.options.nameSingle] ({ commit }, item_payload) {
        return self.deleteItem(commit, config, item_payload.item, item_payload.id_parent)
      },
      ['clear' + config.options.nameSingle] ({ commit }) {
        return self.clearItem(commit, config)
      },
      ['clearAll' + config.options.name] ({ commit }) {
        return self.clearItem(commit, config)
      }
    }
  },

  /*
  |--------------------------------------------------------------------------
  | GET ALL
  |--------------------------------------------------------------------------
  |
  */
  getBaseAll (commit, config) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      Vue.$log.debug('promise --')
      var _callback = items => {
        commit('RECEIVE_' +  config.options.name, { items })
        commit('RECEIVE_LOAD_PARTIAL',  config.options.displayName)
        resolve()
      }
      Vue.$EventBus.$emit('apiGet', config.options.dataUrl, _callback)
    })
  },
  /*
  |--------------------------------------------------------------------------
  | GET by PARENT
  |--------------------------------------------------------------------------
  |
  */
  getByParent (commit, config, id_parent) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      if (config.options.dataFromLaravel) {
        let dataRelatedLaravel = config.options.dataRelatedLaravel
        let dataIdRelated = config.options.dataIdRelated
        let dataLoadOnParentForm = config.options.dataLoadOnParentForm
        if (dataLoadOnParentForm) {
          // commit('CLEAR_ALL_' +  config.options.name)
          var _callback = (items) => {
            commit('RECEIVE_' +  config.options.name, { items })
            commit('GET_BY_PARENT_LARAVEL_' + config.options.name, { id_parent, dataRelatedLaravel, dataIdRelated, dataLoadOnParentForm })
            resolve()
          }
          Vue.$EventBus.$emit('apiGet', config.options.dataUrl + '/' + id_parent , _callback)
        } else {
          commit('GET_BY_PARENT_LARAVEL_' + config.options.name, { id_parent, dataRelatedLaravel, dataIdRelated, dataLoadOnParentForm })
          resolve()
        }
      } else {
        commit('GET_BY_PARENT_' + config.options.name, { id_parent })
        resolve()
      }
    })
  },
  /*
  |--------------------------------------------------------------------------
  | GET
  |--------------------------------------------------------------------------
  |
  */
  getItem (commit, config, id) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      commit('GET_' + config.options.nameSingle, { id })
      resolve()
    })
  },
  /*
  |--------------------------------------------------------------------------
  | UPDATE
  |--------------------------------------------------------------------------
  |
  */
  updateItem (commit, config, item) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      var _callback = itemApi => {
        commit('UPDATE_' + config.options.nameSingle, { itemApi })
        resolve()
      }
      Vue.$EventBus.$emit('apiUpdate', config.options.dataUrl, item, _callback)
    })
  },
  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  |
  */
  saveItem (commit, config, item) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve, reject) => {
      var _callback = itemApi => {
        if (itemApi) {
          commit('SAVE_' + config.options.nameSingle, { itemApi })
          // Param to callback
          resolve(itemApi)
        } else {
          reject(itemApi)
        }
      }
      Vue.$EventBus.$emit('apiSave', config.options.dataUrl, item, _callback)
    })
  },
  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  |
  */
  deleteItem (commit, config, item, id_parent) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      // eslint-disable-next-line no-unused-vars
      var _callback = itemApi => {
        commit('DELETE_' + config.options.nameSingle, { item })
        resolve()
      }
      if (id_parent && config.options.dataFromLaravel) {
        Vue.$EventBus.$emit('apiDelete', config.options.dataUrl, item, _callback, null, id_parent)
      } else {
        Vue.$EventBus.$emit('apiDelete', config.options.dataUrl, item, _callback)
      }
    })
  },
  /*
  |--------------------------------------------------------------------------
  | CLEAR
  |--------------------------------------------------------------------------
  |
  */
  clearItem (commit, config) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      commit('CLEAR_' + config.options.nameSingle)
      resolve()
    })
  },
  /*
  |--------------------------------------------------------------------------
  | CLEAR ALL
  |--------------------------------------------------------------------------
  |
  */
  clearAll (commit, config) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      commit('CLEAR_ALL_' + config.options.name)
      resolve()
    })
  },
}
