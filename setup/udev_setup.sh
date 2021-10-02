echo Creating udev rules for Axpert USB HID
sudo cp ./axpert_udev_rules /etc/udev/rules.d/axpert.rules
read -p "Make sure your inverter is unplugged then press [Enter]"
sudo udevadm control --reload-rules
