// Drive menu extension
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const St = imports.gi.St;
const Shell = imports.gi.Shell;

const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ShellMountOperation = imports.ui.shellMountOperation;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


const MountMenuItem = new Lang.Class({
    Name: 'DriveMenu.MountMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(name) {
        this.parent();

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

    _syncVisibility: function() {
    },

    activate: function(event) {
        this.parent(event);
    }
});

const DriveMenu = new Lang.Class({
    Name: 'DriveMenu.DriveMenu',
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(0.0, "Removable devices");

        let hbox = new St.BoxLayout({style_class: 'panel-status-menu-box'});
        let icon = new St.Icon({
            icon_name: 'media-eject-symbolic',
            style_class: 'system-status-icon'
        });
        hbox.add_child(icon);
        hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.actor.add_child(hbox);

        this._mounts = ["power"];

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addMenuItem(new MountMenuItem("foo"));
        // this.menu.addAction("Open File", function(event) {
        //     let appSystem = Shell.AppSystem.get_default();
        //     let app = appSystem.lookup_app('org.gnome.Nautilus.desktop');
        //     app.activate_full(-1, event.get_time());
        // });
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
