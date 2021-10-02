# axpert-monitor

Monitor Voltronic/Axpert inverter via USB


## Why

I and couldn't find another node based solution.

#### Why node

I like node and I have other software I wanted to integrate it with.

#### Why USB

It allows direct connection without bothering with Serial converters.

## Interface Design
See [design documentation](./documentation/design.md)


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

### Programatically
