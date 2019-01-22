"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isObject = _interopRequireDefault(require("./isObject"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mergeDeep = function mergeDeep() {
  for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }

  objs.reverse();
  return objs.reduce(function (newObj, current) {
    var objKeys = Object.keys(newObj);

    for (var i = 0; i < objKeys.length; i++) {
      var prop = objKeys[i];

      if (current.hasOwnProperty(prop)) {
        if ((0, _isObject.default)(newObj[prop]) && (0, _isObject.default)(current[prop]) && Object.keys(newObj[prop]).length > 0) {
          newObj[prop] = mergeDeep(current[prop], newObj[prop]);
        }
      }
    }

    return _objectSpread({}, current, newObj);
  }, {});
};

var _default = mergeDeep;
exports.default = _default;