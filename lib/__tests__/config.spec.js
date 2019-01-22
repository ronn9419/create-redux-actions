"use strict";

var _config = require("../config");

var initialConfig = {
  initialState: {
    pending: false,
    error: false,
    data: []
  }
};
describe('config', function () {
  it('get config', function () {
    var config = (0, _config.getConfig)();
    expect(config).toMatchObject(initialConfig);
  });
  it('resets config', function () {
    (0, _config.setConfig)({
      initialState: {}
    });
    var config = (0, _config.getConfig)();
    expect(config).toMatchObject({
      initialState: {}
    });
    (0, _config.resetConfig)();
    config = (0, _config.getConfig)();
    expect(config).toMatchObject(initialConfig);
  });
  it('set config, deep merge', function () {
    (0, _config.setConfig)({
      initialState: {},
      newConfig: {
        data: 1
      }
    });
    var config = (0, _config.getConfig)();
    expect(config).toMatchObject({
      initialState: {},
      newConfig: {
        data: 1
      }
    });
    (0, _config.resetConfig)();
  });
});