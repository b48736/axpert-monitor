# axpert-monitor

Monitor Voltronic/Axpert inverter via USB

## Why

I and couldn't find another node based solution. But thanks to [JosefKrieglstein's python implementation](https://github.com/JosefKrieglstein/AxpertControl) for useful information.

#### Why node

I like node and I have other node based packages I wanted to integrate it with.

#### Why USB

It allows direct connection without bothering with RS232 converters.

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

### Important note

This module has only been tested on Raspbian GNU/Linux 10 (buster).

In order for this module to access hidraw interface, some OS changes are necessary. See full details on the [nide-hid library page](https://github.com/node-hid/node-hid#udev-device-permissions)

A helper script has been added to automate the udev changes. This has only been tested on raspbian.

```sh
npm run udev-setup
```

### CLI

#### axpert-query

Sends any inquiry command via CLI and prints formatted response if a parser is implemented for the query, otherwise the raw string response is printed.

##### parameters

- -c, --command: the inquery command to send. Must start with a 'Q'
- -r, --raw: show the raw, unformatted response string

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
  }
}

```

##### Example - raw

```sh
$ axpert-query -c QPIGS -r
Sending command: QPIGS
235.9 50.1 231.7 50.1 0344 0272 006 368 52.90 000 037 0050 0000 000.0 00.00 00005 00010000 00 00 00000 010
```

### Programatically

## Limitations / Future

### Query parsers

Currently only some inquery commands have parsers implemented. The following are not yet implemented and will only return the raw string response when executed:

- QVFW2
- QDI
- QMCHGCR
- QMUCHGCR

### multiple inverter support

The module tries to connect to the inverter using the VendorID and ProductID and has only been tested with a single inverter connected on USB at a time.

If multiple inverters are connected that match the VID and PID, a mechanism would be needed to select the desired inverter.

One solution would be to use the device path like:

> /dev/hidraw2

Another option is to detect all matching devices, query each and allow selecting based on the serial number, or simply specify the offset (0th, 1st device found).
