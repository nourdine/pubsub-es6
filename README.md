lepubsub
==========

**LePubSub** is a classic, good old (but gold!) publisher/subscriber utility that will allow you to enforce heavy decoupling in your applications.

### Intro

A _publisher/observer_ **central hub** is a utility which can be simultaneously used by various components in the same ecosystem for the following two reasons:

   1. to keep themselves up-to-date about facts going on in the application
   2. to publish events so that other components, if interested, can adjust accordingly

This pattern represents decoupling in its purest form and allows for scalable application of arbitrary complexity.

### Get an instance

```js
const LePubSub = require("lepubsub").default;

// the `new` way
var ps = new LePubSub();

// or...
var ps = LePubSub.singleton();
```

### Register callbacks

```js
ps.subscribe("event_name", (ev, arg1, arg2, arg3) => {
   console.log(arg1, arg2, arg3);
});

// or, if you prefer your callback to be executed only once...
ps.once("event_name", (ev, arg1, arg2, arg3) => {
   console.log(arg1, arg2, arg3);
});

// finally, you can register a callback which will be executed every time the event is published with params that are different from the ones passed the last time.
// The registration can be done so that only certain params are taken into consideration and ANY or ALL of them have actually changed.
ps.subscribeToDiff("event_name",
   "any|all", // ANY or ALL the selected params will have to change for the callback to be executed
   (arg1, arg2, arg3) => {
      return [arg1, arg2]; // the comparison will be performed only on `arg1` and `arg2`
   },
   (ev, arg1, arg2) => {
      console.log(arg1);
});
```

### Publish events

```js
// callbacks are executed in the current tick
ps.publish("event_name", "hello", "world", "!");

// callbacks are executed in a non-blocking manner
ps.publishAsync("event_name", "hello", "world", "!");
```

### Unregister a callback

```js
var cb = (ev, arg1, arg2) => {
   console.log(arg1, arg2);
};

ps.subscribe("event_name", cb);

// but then, later on, you change your mind.. it happens ;)
ps.unregister("event_name", cb);

// cb won't be invoked anymore
ps.publish("event_name", "hello", "world!");
```

### Flush a whole event and its callbacks

```js
ps.subscribe("event_name", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

ps.once("event_name", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

// but then, later on, you change your mind and want to flush all callbacks (oncers and normal ones) of a certain event
ps.flush("event_name");

// no callback will be invoked
ps.publish("event_name", "hello", "world!");
```

### Reset the whole thing

```js
ps.subscribe("event_name_1", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

ps.once("event_name_1", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

ps.subscribe("event_name_2", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

ps.once("event_name_2", (ev, arg1, arg2) => {
   console.log(arg1, arg2);
});

// but then, later on, you decide to reset the whole thing and flush every callback ever registered to any event
ps.reset();

// no callback will be invoked
ps.publish("event_name_1", "hello", "world!");
ps.publish("event_name_2", "hello", "world!");
```

### Run Tests ###

```cmd
npm i
npm t
```
