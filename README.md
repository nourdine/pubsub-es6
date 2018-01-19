## PubSub

This is a classic, good old publisher/subscriber utility that will let you enforce and increment heavy decoupling in your applications.

### Intro

A _publisher/observer_ **central hub** is a foundamental component of an application that allows dispatching messages across a channel where multiple parts of the app itself are listening or sending messages.

This allows the design to stay **fully decoupled**: any part `A` that wants to let some other part `B` know that something just happened, can simply throw a message in the air and if `B` is listening and is also interested in what happened, it will react accordingly. Otherwsie nothing will happen. 

`A` won't have to know about `B` and `B` can be removed at any time from the app and everythig will still work. This is decoupling in its purest form and allows for scalable application of arbitary complexities.

Obviously `PubSub` can also be **extended** so that every class in the application can be made obeservable and multiple communication channels are therefore made available as a result. It is down to the developer to decide what design path to undertake.

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

// but then, later on, you change your mind and want to reset the whole thing
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

// but then, later on, you decide to reset the whole thing and flush any callback ever registered with any event
ps.reset();

// no callback will be invoked
ps.publish("event_name", "hello", "world!");
```