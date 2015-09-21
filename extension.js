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

        // let ejectIcon = new St.Icon({
        //     icon_name: 'video-display-symbolic',
        //     style_class: 'popup-menu-icon'
        // });
        let ejectButton = new St.Button({/*child: ejectIcon*/});
        // ejectButton.connect('clicked', Lang.bind(this, this._eject));
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
            "power": [
                {"path": "power/on",  "name": "Power On"},
                {"path": "power/off", "name": "Power Off"},
            ],
            "mute": [
                {"path": "mute/on",   "name": "Mute On"},
                {"path": "mute/off",  "name": "Mute Off"},
            ],
        }

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
