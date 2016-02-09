'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = crudCollection;

var _redux = require('redux');

var _lodash = require('lodash');

var _actionTypesFor = require('utils/actionTypesFor');

var _actionTypesFor2 = _interopRequireDefault(_actionTypesFor);

var _crudItem = require('utils/crudItem');

var _crudItem2 = _interopRequireDefault(_crudItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // redux is already using

function crudCollection(forType) {
  var actions = (0, _actionTypesFor2.default)(forType);

  var statusReducer = function statusReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 'success' : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
  };

  var errorReducer = function errorReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
  };

  var itemsReducer = function itemsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.fetchSuccess:
        return action.items.map(function (s) {
          return (0, _crudItem2.default)(forType)({ data: s }, action);
        });
      case actions.createSuccess:
        var mergedItems = [].concat(_toConsumableArray(state), _toConsumableArray(action.items.map(function (s) {
          return { data: s };
        })));
        return mergedItems.map(function (s) {
          return (0, _crudItem2.default)(forType)(s, action);
        });
      case actions.deleteSuccess:
        // TODO: id => cid
        return state.filter(function (s) {
          return action.items.indexOf(s.data.id) === -1;
        });
      case actions.updateSuccess:
        return state.map(function (s) {
          var update = (0, _lodash.find)(action.items, { cid: s.cid });
          return update ? (0, _crudItem2.default)(forType)(s, _extends({}, action, update.update)) : s;
        });
      default:
        return state.map(function (s) {
          return (0, _crudItem2.default)(forType)(s, action);
        });
    }
  };

  return (0, _redux.combineReducers)({
    status: statusReducer,
    error: errorReducer,
    items: itemsReducer
  });
}