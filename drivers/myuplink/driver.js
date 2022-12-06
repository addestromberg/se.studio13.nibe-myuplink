'use strict';

const { OAuth2Driver } = require('homey-oauth2app');

class NibeMyUplinkDriver extends OAuth2Driver {

  async onOAuth2Init() {
    // Register Flow Cards etc.
    this.log('Nibe myUplink has been initialized');
  }

  /**
   * List compatible devices.
   * @TODO Add check if device is compatible and build a list.
   * @param {oAuth2Client} oauthclient
   * @returns list of devices
   */
  async onPairListDevices({ oAuth2Client }) {
    const systems = await oAuth2Client.getSystems();
    const { systemId } = systems.systems[0];
    return systems.systems[0].devices.map((device) => {
      return {
        name: device.product.name,
        data: {
          id: device.id,
        },
        store: {
          systemId,
        },
      };
      // return [
      // Example device data, note that `store` is optional
      // {
      //   name: 'My Device',
      //   data: {
      //     id: 'my-device',
      //   },
      //   store: {
      //     address: '127.0.0.1',
      //   },
      // },
      // ];
    });
  }

}

module.exports = NibeMyUplinkDriver;
