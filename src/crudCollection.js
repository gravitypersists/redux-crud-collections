import { combineReducers } from 'redux';
import { find, uniqBy } from 'lodash';

import actionTypesFor from './actionTypesFor';
import crudItemFor from './crudItem';

export default function crudCollection(forType, options = {}) {
  const crudItem = crudItemFor(forType)

  const unique = (items) => {
    return options.uniqueBy ? uniqBy(items, options.uniqueBy) : items;
  }

  const mergeNew = (oldItems, newItems) => {
    return [...oldItems, ...newItems.map(s => ({ data: s }))];
  }

  const actions = actionTypesFor(forType);

  const statusReducer = (state = 'success', action = {}) => {
    switch (action.type) {
      case actions.fetchStart:
        return 'pending';
      case actions.fetchSuccess:
        return 'success';
      case actions.fetchError:
        return 'error';
      default:
        return state;
    }
  }

  const errorReducer = (state = null, action = {}) => {
    switch (action.type) {
      case actions.fetchStart:
        return null;
      case actions.fetchSuccess:
        return null;
      case actions.fetchError:
        return action.error;
      default:
        return state;
    }
  }

  const itemsReducer = (state = [], action = {}) => {
    switch (action.type) {
      case actions.createSuccess:
      case actions.fetchSuccess:
        return unique(mergeNew(state, action.items)).map(s => crudItem(s, action));
      case actions.deleteSuccess:
        const filterOut = (options.uniqueBy) ? s.data[uniqueBy] : s.cid;
        return state.filter(s => action.items.indexOf(s.data.id) === -1);
      case actions.updateSuccess:
        return state.map(s => {
          const update = find(action.items, { cid: s.cid });
          return (update) ? crudItem(s, { ...action, ...update.update }) : s;
        });
      default:
        return state.map(s => crudItem(s, action));
    }
  }

  return combineReducers({
    status: statusReducer,
    error: errorReducer,
    items: itemsReducer
  });
}