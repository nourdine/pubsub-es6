const assert = require("assert");
const sinon = require("sinon");
const LePubSub = require("./../").default;

describe("LePubSub", () => {

   var ps;
   var callback;
   var callback2;

   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
      callback2 = sinon.spy();
   });

   it("Has a singleton method that works", () => {
      assert(LePubSub.singleton() === LePubSub.singleton());
   });

   it("Throws an exception if the event when want to register to is not a string", () => {
      assert.throws(function () {
         ps.subscribe(null, callback);
      });
      assert.throws(function () {
         ps.once(null, callback);
      });
   });

   it("Throws an exception if the callback when want to register is not a function", () => {
      assert.throws(function () {
         ps.once("event", null);
      });
      assert.throws(function () {
         ps.once(null, callback);
      });
   });

   it("Allows a callback to be registered only once with a certain event (normal cbs are stored in a Set)", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
   });

   it("Executes all and only the registered callbacks of an event when that event gets published", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_1", callback2);
      ps.subscribe("event_2", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(callback2.callCount, 1);
      assert.equal(callback.getCall(0).args[0], "event_1");
      assert.equal(callback.getCall(0).args[1], 42);
      assert.equal(callback2.getCall(0).args[0], "event_1");
      assert.equal(callback2.getCall(0).args[1], 42);
   });

   it("Allows a callback to be ONCEREGISTERED only once with a certain event (once cbs are stored in a Set)", () => {
      ps.once("event_1", callback);
      ps.once("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
   });

   it("Executes all and only the registered `once` callbacks of an event when that event gets published", () => {
      ps.once("event_1", callback);
      ps.once("event_1", callback2);
      ps.once("event_2", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(callback2.callCount, 1);
      assert.equal(callback.getCall(0).args[0], "event_1");
      assert.equal(callback.getCall(0).args[1], 42);
      assert.equal(callback2.getCall(0).args[0], "event_1");
      assert.equal(callback2.getCall(0).args[1], 42);
   });

   it("Executes the registered `once` callbacks only once (you don't say)", () => {
      ps.once("event_1", callback);
      ps.once("event_1", callback2);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(callback2.callCount, 1);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(callback2.callCount, 1);
   });

   it("Allow you to unregister a callback from a particular event", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_2", callback);

      ps.unsubscribe("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
   });

   it("Allows you to unregister a `once` callback from a particular event", () => {
      ps.once("event_1", callback);
      ps.once("event_2", callback);

      ps.unsubscribe("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
   });

   it("Lets you flush all callbacks registered with a certain event", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_2", callback);
      ps.once("event_1", callback);

      assert.equal(ps.countSubscribers("event_1"), 1);
      assert.equal(ps.countSubscribers("event_2"), 1);
      assert.equal(ps.countOncers("event_1"), 1);

      ps.flush("event_1");

      assert.equal(ps.countSubscribers("event_1"), 0);
      assert.equal(ps.countSubscribers("event_2"), 1);
      assert.equal(ps.countOncers("event_1"), 0);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(ps.countSubscribers("event_2"), 1);
   });

   it("Lets you flush all callbacks registered with every event", () => {
      ps.subscribe("event_1", callback);
      ps.once("event_2", callback);

      assert.equal(ps.countSubscribers("event_1"), 1);
      assert.equal(ps.countOncers("event_2"), 1);

      ps.reset();

      assert.equal(ps.countSubscribers("event_1"), 0);
      assert.equal(ps.countOncers("event_2"), 0);

      ps.publish("event_1", 42);
      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 0);
   });
});
