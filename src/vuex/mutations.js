/*
|--------------------------------------------------------------------------
| Import core
|--------------------------------------------------------------------------
|
*/
import Vue from 'vue'

/*
|--------------------------------------------------------------------------
| CORE vuex mutations
|--------------------------------------------------------------------------
|
*/
export default {
  core (state, config) {
    var self = this
    return {
      ['RECEIVE_' + config.options.nameVuex] (state, { items }) {
        self.getAll(state, items)
      },
      ['GET_BY_PARENT_' + config.options.nameVuex] (state, { id_parent }) {
        self.getAllByParent(state, id_parent)
      },
      ['GET_BY_PARENT_LARAVEL_' + config.options.nameVuex] (state, { id_parent, dataRelatedLaravel, dataIdRelated, dataLoadOnParentForm }) {
        self.getAllByParentLaravel(state, id_parent, dataRelatedLaravel, dataIdRelated, dataLoadOnParentForm)
      },
      ['GET_' + config.options.nameSingleVuex] (state, { id }) {
        self.getItem(state, id)
      },
      ['UPDATE_' + config.options.nameSingleVuex] (state, { itemApi }) {
        self.updateItem(state, itemApi)
      },
      ['SAVE_' + config.options.nameSingleVuex] (state, { itemApi }) {
        self.saveItem(state, itemApi)
      },
      ['UPLOAD_' + config.options.nameSingleVuex] (state, { itemApi }) {
        self.uploadItem(state, itemApi)
      },
      ['DELETE_' + config.options.nameSingleVuex] (state, { item }) {
        self.deleteItem(state, item)
      },
      ['CLEAR_' + config.options.nameSingleVuex] (state) {
        self.clearItem(state)
      },
      ['CLEAR_ALL_' + config.options.nameVuex] (state) {
        self.clearAll(state)
      }
    }
  },

  /*
  |--------------------------------------------------------------------------
  | GET
  |--------------------------------------------------------------------------
  |
  */
  getAll (state, items) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    state.all = items
  },
  getAllByParent (state, id_parent) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    let newStates = state.all.filter(item => item.id_parent === id_parent)

    Vue.set(state, 'allByParent', newStates)
  },
  getAllByParentLaravel (state, id_parent, dataRelatedLaravel, dataIdRelated, dataLoadOnParentForm) {
    // Degub
    Vue.$log.debug('MUTATIONS')

    let newStates = null

    if (dataRelatedLaravel) { 
      if (state.all.length > 0) {
        newStates = state.all.filter( function(item) {
          let relateds = item[dataRelatedLaravel].filter( function(related) {
            return related.id === id_parent
          })
          return relateds.length > 0
        })
      }
    }
    if (dataIdRelated) {
      if (state.all.length > 0) {
        newStates = state.all.filter( function(item) {
          return item[dataIdRelated] === id_parent
        })
      }
    }
    if (dataLoadOnParentForm) { 
      if (state.all.length > 0) {
        newStates = state.all.filter( function(/*item*/) {
          return true
        })
      }
      Vue.$EventBus.$emit('storeAllByParentSet')
    }
    Vue.set(state, 'allByParent', newStates)
  },
  getItem (state, id) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    state.item = state.all.filter(item => item.id === id)[0]
    state.clone = Object.assign({}, state.item)
  },
  clearItem (state) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    state.item = {}
    state.clone = {}
  },
  clearAll (state) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    // state.all = []
    // state.allByParent = []
    Vue.set(state, 'all', [])
    Vue.set(state, 'allByParent', [])
    state.item = {}
    state.clone = {}
  },
  /*
  |--------------------------------------------------------------------------
  | UPDATE
  |--------------------------------------------------------------------------
  |
  */
  updateItem (state, item) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    // Update all
    this.__updateItemState(state.all, item)
    if (state.allByParent) {
      // Update allByParent
      this.__updateItemState(state.allByParent, item)
    }
  },
  __updateItemState (stateEl, item, indexEl) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    var index = stateEl.findIndex(function(element) {
      return element.id === item.id;
    })
    // Overwrite
    if (indexEl){
      index = indexEl
    }
    var clone = Object.assign({}, item)
    stateEl.splice(index, 1)
    stateEl.push(clone)
  },
  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  |
  */
  saveItem (state, item) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    // Save all
    this.__saveItemState(state.all, item)
    if (state.allByParent) {
      // Save allByParent
      this.__saveItemState(state.allByParent, item)
    }
  },
  __saveItemState (stateEl, item) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    var clone = Object.assign({}, item)
    stateEl.push(clone)

    // Return
    return stateEl
  },
  /*
  |--------------------------------------------------------------------------
  | UPLOAD
  |--------------------------------------------------------------------------
  |
  */
  uploadItem (/*state, item*/) {
    // Degub
    Vue.$log.debug('MUTATIONS')
  },
  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  |
  */
  deleteItem (state, item) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    // Delete
    this.__deleteItemState(state.all, item)
    if (state.allByParent) {
      // Delete
      this.__deleteItemState(state.allByParent, item)
    }
  },
  __deleteItemState (stateEl, item, indexEl) {
    // Degub
    Vue.$log.debug('MUTATIONS')
    var index = stateEl.findIndex(function(element) {
      return element.id === item.id
    })
    // Overwrite
    if (indexEl){
      index = indexEl
    }
    stateEl.splice(index, 1)
    // Return
    return stateEl
  }
}
