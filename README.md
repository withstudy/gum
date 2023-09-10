# xgum

xgum can manage your git email and name, and set an alias for it to quickly set up git

## command and option

* `xgum -v, --version`
Show you version.
  
* `xgum  -h, --help  `
Show you help info.

* `xgum list`

Show you git email,name list.

* `xgum add -e <email> -n <name> -a <alias>`

Add an item to the list.

* `xgum del -a <alias>`

Removes an item from the list.

* `xgum use -t <type> -a <alias>`

Apply an item to git, type can be global or system or local.