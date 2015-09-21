const Lang = imports.lang;
const St = imports.gi.St;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const API = Me.imports.api;


const MountMenuItem = new Lang.Class({
    Name: 'DriveMenu.MountMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(api, action) {
        this.parent();
        this.api = api;

        this.label = new St.Label({text: action.name});
        this.actor.add(this.label, {expand: true});
        this.actor.label_actor = this.label;

        this.action = action

        let ejectButton = new St.Button({});
        this.actor.add(ejectButton);
        this.actor.visible = true;
    },

    destroy: function() {
        this.parent();
    },

    activate: function(event) {
        this.parent(event);
        this.api.get(this.action.path, function(err, data) {
            log(err);
        });
    }
});


const APIToggle = new Lang.Class({
    Name: "APIToggle.APIToggle",
    Extends: PopupMenu.PopupSwitchMenuItem,

    _init: function(name, api, statusEndpoint, onEndpoint, offEndpoint) {
        this.parent(name, false);
        this.api = api;
        this.statusEndpoint = statusEndpoint;
        this.onEndpoint = onEndpoint;
        this.offEndpoint = offEndpoint;
    },
    destroy: function() {
        this.parent();
    },

    updateStatus: function() {
        this.api.get("mute", function(err, data) {
            global.log(data);
            if (err !== null) {
                return;
            }
            this.setToggleState(data == '1');
        });
    },

    enable: function() {
        this.connect("toggled", Lang.bind(this, this._toggle));
        this.parent();
    },

    disable: function() {
        this.parent();
    },

    _toggle: function(item, state) {
        /*
        if (state) {
            endpoint = self.onEndpoint;
        } else {
            endpoint = self.offEndpoint;
        }

        this.api.get(endpoint, function(err, data) {
        });
        */
    },
});


const DriveMenu = new Lang.Class({
    Name: 'DriveMenu.DriveMenu',
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(0.0, "Removable devices");
        this.api = new API.API();

        let hbox = new St.BoxLayout({style_class: 'panel-status-menu-box'});
        let icon = new St.Icon({
            icon_name: 'video-display-symbolic',
            style_class: 'system-status-icon'
        });
        hbox.add_child(icon);
        hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.actor.add_child(hbox);

        this._mounts = {
            // "power": [
            //     {"path": "power/on",  "name": "Power On"},
            //     {"path": "power/off", "name": "Power Off"},
            // ],
            "mute": [
                {"path": "mute/on",   "name": "Mute On"},
                {"path": "mute/off",  "name": "Mute Off"},
            ],
        }

        // this.powerToggle = new APIToggle("Power", "power", "power/on", "power/off");
        this.powerToggle = new APIToggle("Mute", this.api, "mute", "mute/on", "mute/off");
        this.powerToggle.updateStatus();
        this.menu.addMenuItem(this.powerToggle);
        // this.powerToggle.connect("toggled", Lang.bind(this, _toggle));

        for (classification in this._mounts) {
            value = this._mounts[classification];
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            for (index in value) {
                entry = value[index];
                this.menu.addMenuItem(new MountMenuItem(this.api, entry));
            }
        }
        this.actor.show();
    },

    destroy: function() {
        this.parent();
    },
});


let _indicator;

function enable() {
    _indicator = new DriveMenu;
    Main.panel.addToStatusArea('drive-menu', _indicator);
}

function disable() {
    _indicator.destroy();
}
