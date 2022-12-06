'use strict';

const { OAuth2Client, OAuth2Error } = require('homey-oauth2app');

class MyUplinkOAuth2Client extends OAuth2Client {

  // Required:
  static API_URL = 'https://api.myuplink.com/v2';
  static TOKEN_URL = 'https://api.myuplink.com/oauth/token';
  static AUTHORIZATION_URL = 'https://api.myuplink.com/oauth/authorize';
  static SCOPES = ['READSYSTEM', 'WRITESYSTEM', 'offline_access'];

  // Overload what needs to be overloaded here

  /**
   * If something went wrong at API call.
   * @param {*} error API response
   */
  async onHandleNotOK({ body }) {
    throw new OAuth2Error(body.error);
  }

  /**
   * Get all available parameters from API
   * @param {string} deviceId
   * @returns all parameters
   */
  async getParameters(deviceId) {
    return this.get({
      path: `/devices/${deviceId}/points`,
    });
  }

  /**
   * Sets Hotwater boost to wanted value
   * @param {string} deviceId Id of device
   * @param {string} parameterValue value to update to
   * @returns code 200 if ok.
   */
  async setHotwaterBoost(deviceId, parameterValue) {
    return this.patch({
      path: `/devices/${deviceId}/points`,
      json: { 7086: parameterValue ? 1 : 0 },
    });
  }

  /**
   * Update smart price adaption to desired value
   * @param {string} deviceId id of device
   * @param {string} parameterValue new value
   * @returns Code 200 if ok.
   */
  async setSmartpriceAdaption(deviceId, parameterValue) {
    return this.patch({
      path: `/devices/${deviceId}/points`,
      json: { 4789: parameterValue ? 1 : 0 },
    });
  }

  /**
   * Update the Ventilation Boost
   * @param {string} deviceId
   * @param {string} parameterValue
   * @returns code 200 if ok.
   * @TODO Get the parameterId for ventilation.
   */
  async setVentilationBoost(deviceId, parameterValue) {
    return this.patch({
      path: `/devices/${deviceId}/points`,
      json: { unknown: parameterValue ? 1 : 0 },
    });
  }

  /**
   * Get SmartHome features supported for device.
   *
   * @param {string} DeviceId of unit
   * @returns json list of params as bool
   */
  async getSmartHomeCategories({ deviceId }) {
    return this.get({
      path: `/devices/${deviceId}/smart-home-categories`,
    });
  }

  /**
   * Get all systems registered to user.
   * @returns PagedSystemResult with systems and devices registered to users account.
   */
  async getSystems() {
    return this.get({
      path: '/systems/me',
    });
  }

  // ----------------------------------------------------------------------------------
  // Examples
  async getThings({ color }) {
    return this.get({
      path: '/things',
      query: { color },
    });
  }

  async updateThing({ id, thing }) {
    return this.put({
      path: `/thing/${id}`,
      json: { thing },
    });
  }

}

module.exports = MyUplinkOAuth2Client;
