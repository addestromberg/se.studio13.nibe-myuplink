'use strict';

const { OAuth2Device } = require('homey-oauth2app');

const POLL_INTERVAL = 60; // In seconds

class MyUplinkDevice extends OAuth2Device {

  async onOAuth2Init() {

    // Add new capability to users who already installed.
    if (!this.hasCapability('priorityLog')) this.addCapability('priorityLog');

    // Setup a timer and fetch data from API at x seconds interval
    this.fetchIntervalIndex = setInterval(async () => {
      await this.getParameters();
    }, 1000 * POLL_INTERVAL * 1);

    // Get initial parameters status.
    try {
      await this.getParameters();
    } catch (error) {
      this.log(error);
    }

    // Adds capability listeners for writeable parameters.
    await this.addCapabilityListeners();
    this.log('At Device init end.');
  }

  /**
   * Fetch all parameters available from API
   */
  async getParameters() {
    this.log('Trying to update parameters');
    await this.oAuth2Client.getParameters(this.getData().id)
      .then(async (result) => {
        this.updateValues(result);
      })
      .catch((error) => this.log(error));
  }

  /**
   * Updates Capabilities after API update.
   * @param {array} params list of parameters returned from API.
   */
  updateValues(params) {
    params.forEach((capability) => {
      switch (capability.parameterId) {
        case '7086':
          this.setCapabilityValue('hwBoost', Boolean(capability.value));
          break;
        case '4789':
          this.setCapabilityValue('smartPriceAdaption', Boolean(capability.value));
          break;
        case '14950':
          this.setCapabilityValue('priority', String(capability.value));
          this.setCapabilityValue('priorityLog', capability.value)
          break;
        case '22130':
          this.setCapabilityValue('measure_power', capability.value);
          break;
        case '55027':
          this.setCapabilityValue('internalAddon', String(capability.value));
          break;
        case '8':
          this.setCapabilityValue('feedTemperature', capability.value);
          break;
        case '11':
          this.setCapabilityValue('hwTopTemperature', capability.value);
          break;
        case '4':
          this.setCapabilityValue('outdoorTemperature', capability.value);
          break;
        case '10':
          this.setCapabilityValue('returnLineTemperature', capability.value);
          break;
        case '12':
          this.setCapabilityValue('hwChargingTemperature', capability.value);
          break;
        case '13':
          this.setCapabilityValue('brineInTemperature', capability.value);
          break;
        case '14':
          this.setCapabilityValue('brineOutTemperature', capability.value);
          break;
        case '15':
          this.setCapabilityValue('condenserTemperature', capability.value);
          break;
        case '16':
          this.setCapabilityValue('dischargeTemperature', capability.value);
          break;
        case '17':
          this.setCapabilityValue('liquidLineTemperature', capability.value);
          break;
        case '19':
          this.setCapabilityValue('suctionGasTemperature', capability.value);
          break;
        case '58':
          this.setCapabilityValue('flowSensor', capability.value);
          break;
        case '781':
          this.setCapabilityValue('degreeMinutes', capability.value);
          break;
        case '1708':
          this.setCapabilityValue('calculatedSupplyTemperature', capability.value);
          break;
        case '1975':
          this.setCapabilityValue('heatingMediaPumpSpeed', capability.value);
          break;
        case '1977':
          this.setCapabilityValue('brinePumpSpeed', capability.value);
          break;
        case '2716':
          this.setCapabilityValue('hwEnergyIncludingAddon', capability.value);
          break;
        case '2717':
          this.setCapabilityValue('heatingEnergyIncludingAddon', capability.value);
          break;
        case '2720':
          this.setCapabilityValue('hwEnergyCompressor', capability.value);
          break;
        case '2721':
          this.setCapabilityValue('heatingEnergyCompressor', capability.value);
          break;
        case '5927':
          this.setCapabilityValue('currentCompressorFrequency', capability.value);
          break;
        default:
          break;
      }
    });
  }
  
  /**
   * Add capabilities based on features available.
   * In case capability is settable. Add CapabilityListener
   */
  async addCapabilityListeners() {
    // Add capabilities based on features available in settings here.

    // Hot Water Boost
    await this.registerCapabilityListener('hwBoost', async (value) => {
      this.oAuth2Client.setHotwaterBoost(this.getData().id, value)
        .then(async (result) => {
          if (result.status === 200) this.log('Updated value');
        }).catch(this.log('Something went wrong when setting HW boost.'));
    });

    // Smartprice Adaption
    await this.registerCapabilityListener('smartPriceAdaption', async (value) => {
      this.oAuth2Client.setSmartpriceAdaption(this.getData().id, value)
        .then(async (result) => {
          if (result.status === 200) this.log('Updated value');
        }).catch(this.log('Something went wrong setting Smartprice adaption.'));
    });
  }

  /**
   * User Updated settings. Handle changes.
   * @param {dict} settings oldSettings, newSettings, changedKeys
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    // lets wipe capabilities that can be changed with settings and re-add them
  }

  async onOAuth2Deleted() {
    // Clean up here
  }

}

module.exports = MyUplinkDevice;
