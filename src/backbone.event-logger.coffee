((root, factory)->
  if typeof exports is 'object' and root.require
    module.exports = factory require("underscore"), require("backbone")
  else if typeof define is 'function' and define.amd
    # AMD
    define ['underscore', 'backbone'], (_,Backbone)->
      factory (_ or root._), (Backbone or root.Backbone)
  else
    # RequireJS
    factory _, Backbone
  
)(@, (_, Backbone)->
  "use strict"
  
  #
  # Defaults styles/colors
  logStyles =
    timestamp:
      color: "gray"
    label:
      color: "white"
      "border-radius": "2px"
    event:
      color: "blue"
      "font-weight": "bold"
      "font-size": "110%"
  labelColors =
    Model: "red"
    Collection: "purple"
    Router: "black"
  
  debugEvents = (parts)->
    (prefix)->
      @__debugEvents = @__debugEvents or {}
      if prefix is false
        return @off("all", @__debugEvents.log, @)
      else if prefix isnt true
        @__debugEvents.prefix = prefix or ""
      if "log" of @__debugEvents
        # Check events were registered
        if "_events" of @ and "all" of @_events
          exists = _.some @_events.all
          , (item) ->
            item.callback is @__debugEvents.log and item.context is @
          , @
          return if exists
      else
        # Create function when event triggered
        labelCss = _.extend logStyles.label
        , background: labelColors[parts]

        css =
          timestamp: _.map(
            logStyles.timestamp
          ,
            (val, key)-> key + ":" + val
          ).join(";")

          label: _.map(
            labelCss
          , 
            (val, key)-> key + ":" + val
          ).join(";")

          event: _.map(
            logStyles.event
          , 
            (val, key)-> key + ":" + val
          ).join(";")

        @__debugEvents.log = (eventName) ->
          labelName = parts
          labelName += ":" + @__debugEvents.prefix if @__debugEvents.prefix
          console.debug "%c%s %c%s%c %s"
          , css.timestamp
          , new Date().toString().match(/(\d+:\d+:\d+)/)[1]
          , css.label, " " + labelName + " "
          , css.event, eventName
          , Array::slice.call(arguments, 1)
          @off "all", @__debugEvents.log, @  if eventName is "remove"
      @on "all", @__debugEvents.log, @
    
  # replace prototype initialize function of Backbone Classes
  _.each labelColors, (val, key) ->
    Backbone[key]::debugEvents = debugEvents key
    Backbone[key]::initialize = (o)->
      @debugEvents @constructor.name
)
