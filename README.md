Backbone-event-logger
=====================

Arranged [this](http://qiita.com/ktty1220/items/f1bb5b4eb48839de8394) and componentized for bower.

Usage
----

```
$ bower install backbone-event-logger
```

```
<script src="/bower_components/backbone/backbone-min.js"></script>
<script src="/bower_components/backbone-event-logger/backbone-event-logger.min.js"></script>
```

Arranged
----

- Auto enable logging after the script loaded
- Convert .js to .coffee
- Change module name(.debug -> .event-logger) because it isnt debugging but logging
- Add AMD/RequireJS idiom
