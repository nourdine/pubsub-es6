## PubSub module

This is a standard (classic, good old) publisher/subscriber utility that will let you decouple your applications.

### Get an instance

```js
const PubSub = require("pubsub_es6");

// the `new` way
var ps = new PubSub();

// or...
var ps = PubSub.singleton();  
```

### Register callbacks

```js
ps.subscribe("event_name", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

// or, if you prefer your callback to be executed once only (regardless of the number of times the event is published)...
ps.once("event_name", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

// and finally you can even register the same callback to multiple events
ps.subscribe(["event_name", "another_event_name"], (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

ps.once(["event_name", "another_event_name"], (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});
```

### Publish events

```js
ps.publish("event_name", "hello", "world!");
```

### Unregister a callback

```js
var cb = (ev, arg1, arg2) => {
   console.log(arg1, arg2);
};

ps.subscribe("event_name", cb);

// but then, later on, you change your mind (it happens)
ps.unregister("event_name", cb);

// cb won't be invoked
ps.publish("event_name", "hello", "world!");
```

### Flush a whole event

```js
ps.subscribe("event_name", (ev, arg1, arg2) => {
   // first callback
   console.log(arg1, arg2);
});

ps.subscribe("event_name", (ev, arg1, arg2) => {
   // second callback
   console.log(arg1, arg2);
});

// but then, later on, you change your mind and want to reset the whole thing
ps.flush("event_name");

// no callback will be invoked
ps.publish("event_name", "hello", "world!");
```
