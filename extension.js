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

    _init: function(api, name) {
        this.parent();
        this.api = api;

        this.label = new St.Label({text: name});
        this.actor.add(this.label, {expand: true});
        this.actor.label_actor = this.label;

        this.name = name;

        let ejectIcon = new St.Icon({
            icon_name: 'media-eject-symbolic',
            style_class: 'popup-menu-icon'
        });
        let ejectButton = new St.Button({child: ejectIcon});
        // ejectButton.connect('clicked', Lang.bind(this, this._eject));
        this.actor.add(ejectButton);
        this.actor.visible = true;
    },

    destroy: function() {
        this.parent();
    },

    activate: function(event) {
        this.parent(event);
        this.api.get(this.name, function(err, data) {
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
            icon_name: 'media-eject-symbolic',
            style_class: 'system-status-icon'
        });
        hbox.add_child(icon);
        hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.actor.add_child(hbox);

        this._mounts = ["power/on", "power/off", "mute/on", "mute/off"];

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        for (endpoint in this._mounts) {
            this.menu.addMenuItem(new MountMenuItem(this.api, this._mounts[endpoint]));
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
