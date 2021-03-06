/* ================================================================
 * macaca-client by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var fs = require('fs');
var path = require('path');
var detect = require('detect-port');
var logger = require('../common/logger');
var Webdriver = require('webdriver-server');

var file = path.join(__dirname, '..', '..', '.config.json');

function *parseOptions(options) {
  var port = yield detect(options.port);

  if (port !== options.port) {
    logger.info('port: %d was occupied, changed port: %d', options.port, port);
    options.port = port;
  }
}

function *bootstrap(options, callback) {
  yield parseOptions(options);

  var webdriver = new Webdriver(options);

  webdriver.start(function(webdriverServer) {
    logger.info('webdriver sdk launched');
    fs.writeFileSync(file, JSON.stringify(webdriver.options), 'utf8');
    callback && callback(webdriverServer);
  });
}

module.exports = bootstrap;
