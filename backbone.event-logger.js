(function() {
  (function(root, factory) {
    if (typeof exports === 'object' && root.require) {
      return module.exports = factory(require("underscore"), require("backbone"));
    } else if (typeof define === 'function' && define.amd) {
      return define(['underscore', 'backbone'], function(_, Backbone) {
        return factory(_ || root._, Backbone || root.Backbone);
      });
    } else {
      return factory(_, Backbone);
    }
  })(this, function(_, Backbone) {
    "use strict";
    var debugEvents, labelColors, logStyles;
    logStyles = {
      timestamp: {
        color: "gray"
      },
      label: {
        color: "white",
        "border-radius": "2px"
      },
      event: {
        color: "blue",
        "font-weight": "bold",
        "font-size": "110%"
      }
    };
    labelColors = {
      Model: "red",
      Collection: "purple",
      Router: "black"
    };
    debugEvents = function(parts) {
      return function(prefix) {
        var css, exists, labelCss;
        this.__debugEvents = this.__debugEvents || {};
        if (prefix === false) {
          return this.off("all", this.__debugEvents.log, this);
        } else if (prefix !== true) {
          this.__debugEvents.prefix = prefix || "";
        }
        if ("log" in this.__debugEvents) {
          if ("_events" in this && "all" in this._events) {
            exists = _.some(this._events.all, function(item) {
              return item.callback === this.__debugEvents.log && item.context === this;
            }, this);
            if (exists) {
              return;
            }
          }
        } else {
          labelCss = _.extend(logStyles.label, {
            background: labelColors[parts]
          });
          css = {
            timestamp: _.map(logStyles.timestamp, function(val, key) {
              return key + ":" + val;
            }).join(";"),
            label: _.map(labelCss, function(val, key) {
              return key + ":" + val;
            }).join(";"),
            event: _.map(logStyles.event, function(val, key) {
              return key + ":" + val;
            }).join(";")
          };
          this.__debugEvents.log = function(eventName) {
            var labelName;
            labelName = parts;
            if (this.__debugEvents.prefix) {
              labelName += ":" + this.__debugEvents.prefix;
            }
            console.debug("%c%s %c%s%c %s", css.timestamp, new Date().toString().match(/(\d+:\d+:\d+)/)[1], css.label, " " + labelName + " ", css.event, eventName, Array.prototype.slice.call(arguments, 1));
            if (eventName === "remove") {
              return this.off("all", this.__debugEvents.log, this);
            }
          };
        }
        return this.on("all", this.__debugEvents.log, this);
      };
    };
    return _.each(labelColors, function(val, key) {
      Backbone[key].prototype.debugEvents = debugEvents(key);
      return Backbone[key].prototype.initialize = function(o) {
        return this.debugEvents(this.constructor.name);
      };
    });
  });

}).call(this);
