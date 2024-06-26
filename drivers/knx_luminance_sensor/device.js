'use strict';

const KNXGenericDevice = require('../../lib/GenericKNXDevice');
const DatapointTypeParser = require('../../lib/DatapointTypeParser');

class KNXLuminanceSensor extends KNXGenericDevice {

  onInit() {
    super.onInit();
  }

  onKNXEvent(groupaddress, data) {
    super.onKNXEvent(groupaddress, data);
    this.log('event', data);
    if (groupaddress === this.settings.ga_sensor) {
      this.setCapabilityValue('measure_luminance', DatapointTypeParser.dpt9(data))
        .catch((knxerror) => {
          this.log('Set measure_luminance error', knxerror);
        });
    }
  }

  onKNXConnection(connectionStatus) {
    super.onKNXConnection(connectionStatus);

    if (connectionStatus === 'connected') {
      // Reading the groupaddress will trigger a event on the bus.
      // This will be catched by onKNXEvent, hence the return value is not used.
      if (this.settings.ga_sensor) {
        this.knxInterface.readKNXGroupAddress(this.settings.ga_sensor)
          .catch((knxerror) => {
            this.log(knxerror);
          });
      }
    }
  }

  getMeasuredLuminance() {
    if (this.settings.ga_sensor) {
      this.knxInterface.readKNXGroupAddress(this.settings.ga_sensor)
        .catch((knxerror) => {
          this.log(knxerror);
          throw new Error(this.homey.__('errors.sensor_get_failed'));
        });
    }
  }

}

module.exports = KNXLuminanceSensor;
