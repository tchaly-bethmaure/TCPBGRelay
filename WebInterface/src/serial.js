class Serial {
    constructor() {
        this.buffer_in = [];
        this.buffer_out = [];
        this.send_active = false;
    }

    static getPorts() {
        return navigator.usb.getDevices().then(devices => {
            return devices;
        });
    }

    static requestPort() {
        const filters = [
            { 'vendorId': 0x239A }, // Adafruit boards
            { 'vendorId': 0xcafe }, // TinyUSB example
        ];
        return navigator.usb.requestDevice({ 'filters': filters }).then(
            device => {
                return device;
            }
        );
    }

    getEndpoints(interfaces) {
        interfaces.forEach(element => {
            var alternates = element.alternates;
            alternates.forEach(elementalt => {
                if (elementalt.interfaceClass === 0xFF) {
                    console.log("Interface number:");
                    console.log(element.interfaceNumber);
                    this.ifNum = element.interfaceNumber;
                    elementalt.endpoints.forEach(elementendpoint => {
                        if (elementendpoint.direction === "out") {
                            console.log("Endpoint out: ");
                            console.log(elementendpoint.endpointNumber);
                            this.epOut = elementendpoint.endpointNumber;
                        }

                        if (elementendpoint.direction === "in") {
                            console.log("Endpoint in: ");
                            console.log(elementendpoint.endpointNumber);
                            this.epIn = elementendpoint.endpointNumber;
                        }
                    });
                }
            })
        })
    }

    getDevice() {
        let device = null;
        this.ready = false;
        return new Promise((resolve, reject) => {
            Serial.requestPort().then(dev => {
                console.log("Opening device...");
                device = dev;
                this.device = device;
                return dev.open();
            }).then(() => {
                console.log("Selecting configuration");
                return device.selectConfiguration(1);
            }).then(() => {
                console.log("Getting endpoints")
                this.getEndpoints(device.configuration.interfaces);
            }).then(() => {
                console.log("Claiming interface");
                return device.claimInterface(this.ifNum);
            }).then(() => {
                console.log("Select alt interface");
                return device.selectAlternateInterface(this.ifNum, 0);
            }).then(() => {
                console.log("Control Transfer Out");
                return device.controlTransferOut({
                    'requestType': 'class',
                    'recipient': 'interface',
                    'request': 0x22,
                    'value': 0x01,
                    'index': this.ifNum
                })
            }).then(() => {
                console.log("Ready!");
                this.ready = true;
                this.device = device;
                resolve();
            })
        });
    }

    receiveFromOtherGB(data) {
        this.buffer_in.push(data);
    }

    receiveFromMyGB(data) {
        this.buffer_out.push(data);
    }

    sendToMyGB()
    {
        if(this.buffer_in.length > 0){
            this.device.transferIn(this.epIn, this.buffer_in.pop()).then(result => {
               console.log(result);     
            });
        }
    }

    sendToOtherGB() {

        if(this.buffer_out.length > 0)
        {
            return this.device.transferOut(this.epOut, this.buffer_out.pop()); 
        }
    }
}

export { Serial };