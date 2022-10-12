# axpert-monitor

Monitor Voltronic/Axpert inverter via USB

## Why

I and couldn't find another node based solution. But thanks to [JosefKrieglstein's python implementation](https://github.com/JosefKrieglstein/AxpertControl) for useful information regarding CRC error in Axpert firmare.

#### Why node

I like node and I have other node based packages I wanted to integrate it with.

#### Why USB

It allows direct connection without bothering with RS232 converters.

#### Why Serial

It was easy to add, so why not?

## Interface Design

The general thinking is captured in the [design documentation](./documentation/design.md)

## Installation

Locally as dependency

```sh
npm i -S axpert-monitor
```

Globally for CLI interface

```sh
npm i -g axpert-monitor
```

## Usage

### Important note on USB HID interface

This module has only been tested on Raspbian GNU/Linux 10 (buster).

In order for this module to access hidraw interface, some OS changes are necessary. See full details on the [nide-hid library page](https://github.com/node-hid/node-hid#udev-device-permissions)

A helper script has been added to automate the udev changes. This has only been tested on raspbian.

```sh
npm run udev-setup
```

Or, if the module is globally installed:

```sh
axpert-udev-setup
```

### Important note on serial interface

Remeber to add user to dialout group if not already added to allow accessing serial port

```sh
sudo usermod -aG dialout "$USER"
```

### CLI

#### axpert-query

Sends any inquiry command via CLI and prints formatted response if a parser is implemented for the query, otherwise the raw string response is printed.

If no connection parameters are specified this will use the USB interface with default VendorID and ProductID values.

##### parameters

- -c, --command: the inquery command to send. Must start with a 'Q'
- -r, --raw: show the raw, unformatted response string, default=false
- -h, --hid: USB HID raw path, e.g. /dev/hidraw1
- -p, --port: Serial port for tty interface, e.g. /dev/ttyUSB0
- -V, --vid: VendorID to use for HID interface, default=0x665
- -P, --pid: ProductID to use for HID interface, default=0x5161
- -t, --timeout: query timeout in MS, default=10000

##### Example - formatted

```sh
$ axpert-query -c QPIGS
Sending command: QPIGS
{
  "gridVoltage": 234.2,
  "gridFrequency": 50,
  "outputVoltage": 230.2,
  "outputFrequency": 50,
  "outputPowerApparent": 437,
  "outputPowerActive": 279,
  "outputLoadPercent": 8,
  "busVoltage": 368,
  "batteryVoltage": 52.9,
  "batteryChargingCurrent": 0,
  "batteryCapacity": 37,
  "temperature": 50,
  "pvBatteryCurrent": 0,
  "pvInputVoltage": 0,
  "batteryVoltageSCC": 0,
  "batteryDischargeCurrent": 6,
  "status": {
    "addSBUPriorityVersion": false,
    "configChanged": false,
    "sccFirmwareUpdates": false,
    "loadOn": true,
    "batteryVoltToSteady": false,
    "charging": false,
    "chargingSCC": false,
    "chargingAC": false
  },
  "pvPower": 241
}

```

##### Example - raw using ttyUSB0

```sh
$ axpert-query -c QPIGS -r -p /dev/ttyUSB0
Sending command: QPIGS
235.9 50.1 231.7 50.1 0344 0272 006 368 52.90 000 037 0050 0000 000.0 00.00 00005 00010000 00 00 00000 010
```

#### axpert-set

Sends a set command via CLI and returns the respose - ACK if successful, NACK if command failed.

If no connection parameters are specified this will use the USB interface with default VendorID and ProductID values.

##### parameters

- -c, --command: the set command to send. Typically starts with a 'P', 'M' or 'F'
- -v, --value: the value to set. The string is used directly so make sure it is correct
- -h, --hid: USB HID raw path, e.g. /dev/hidraw1
- -p, --port: Serial port for tty interface, e.g. /dev/ttyUSB0
- -V, --vid: VendorID to use for HID interface, default=0x665
- -P, --pid: ProductID to use for HID interface, default=0x5161
- -t, --timeout: query timeout in MS, default=10000

##### Example - Set output mode to Utility

```sh
$ axpert-set -c POP -v 00
Sending command: 'POP00'
ACK
```

**USE AT OWN RISK**

_Changing some parameters while the inverter is in use (like the output frequency) is probably not a good idea._

### Programatically

## Limitations / Future

### Query parsers

Currently only some inquery commands have parsers implemented. The following are not yet implemented and will only return the raw string response when executed:

- QVFW2
- QDI
- QMCHGCR
- QMUCHGCR
