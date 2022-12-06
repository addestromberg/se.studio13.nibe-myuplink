'use strict';

const { OAuth2App } = require('homey-oauth2app');
const MyUplinkOAuth2Client = require('./lib/MyUplinkOAuth2Client');

class MyUplinkApp extends OAuth2App {

  static OAUTH2_CLIENT = MyUplinkOAuth2Client; // Default: OAuth2Client
  static OAUTH2_DEBUG = false; // Default: false
  static OAUTH2_MULTI_SESSION = true; // Default: false
  static OAUTH2_DRIVERS = ['nibe_myuplink']; // Default: all drivers

  async onOAuth2Init() {
    // App inits here
  }

}

module.exports = MyUplinkApp;
