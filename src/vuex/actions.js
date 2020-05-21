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
      ['order' + config.options.nameSingle] ({ commit }, item_payload) {
        return self.orderItem(commit, config, item_payload.item, item_payload.id_parent)
      },
      ['upload' + config.options.nameSingle] ({ commit }, item) {
        return self.uploadItem(commit, config, item)
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
        commit('RECEIVE_' +  config.options.nameVuex, { items })
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
          commit('CLEAR_ALL_' +  config.options.nameVuex)
          var _callback = (items) => {
            commit('RECEIVE_' +  config.options.nameVuex, { items })
            commit('GET_BY_PARENT_LARAVEL_' + config.options.nameVuex, { id_parent, dataRelatedLaravel, dataIdRelated, dataLoadOnParentForm })
            resolve()
          }
          Vue.$EventBus.$emit('apiGet', config.options.dataUrl + '/' + id_parent , _callback)
        } else {
          commit('GET_BY_PARENT_LARAVEL_' + config.options.nameVuex, { id_parent, dataRelatedLaravel, dataIdRelated, dataLoadOnParentForm })
          resolve()
        }
      } else {
        commit('GET_BY_PARENT_' + config.options.nameVuex, { id_parent })
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
      commit('GET_' + config.options.nameSingleVuex, { id })
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
        commit('UPDATE_' + config.options.nameSingleVuex, { itemApi })
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
          commit('SAVE_' + config.options.nameSingleVuex, { itemApi })
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
  | SAVE
  |--------------------------------------------------------------------------
  |
  */
  orderItem (commit, config, item, id_parent) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve/*, reject*/) => {
      var _callback = () => {
        this.getBaseAll(commit, config).then( () => {
          if (id_parent) {
            this.getByParent(commit, config, id_parent).then( () => {
              // Param to callback
              resolve()
            })
          } else {
            // Param to callback
            resolve()
          }
        })
      }
      Vue.$EventBus.$emit('apiOrder', config.options.dataUrl, item, _callback)
    })
  },
  /*
  |--------------------------------------------------------------------------
  | UPLOAD
  |--------------------------------------------------------------------------
  |
  */
  uploadItem (commit, config, item) {
    // Degub
    Vue.$log.debug('ACTIONS')
    return new Promise((resolve, reject) => {
      var _callback = itemApiC => {
        if (itemApiC) {
          if (Array.isArray(itemApiC)) {
            itemApiC.forEach(itemApi => {
              // mutation
              commit('UPLOAD_' + config.options.nameSingleVuex, { itemApi })
            })
            // Param to callback
            resolve(itemApiC[0])  
          } else {
            let itemApi = itemApiC
            // mutation
            commit('UPLOAD_' + config.options.nameSingleVuex, { itemApi })
            // Param to callback
            resolve(itemApi)
          }

        } else {
          reject(itemApiC)
        }
      }
      Vue.$EventBus.$emit('apiUpload', config.options.dataUrl, item, _callback)
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
        commit('DELETE_' + config.options.nameSingleVuex, { item })
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
      commit('CLEAR_' + config.options.nameSingleVuex)
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
      commit('CLEAR_ALL_' + config.options.nameVuex)
      resolve()
    })
  },
}
