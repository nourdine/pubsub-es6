import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

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

   it("Throws an exception if the callback we want to register is not a function", () => {
      assert.throws(function () {
         ps.once("event", null);
      });
      assert.throws(function () {
         ps.once(null, callback);
      });
   });

   it("Allows callbacks to be registered only once to a certain event (normal cbs are stored in a Set)", () => {
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

   it("Executes a registered callback only when ALL parameters passed to it have changed from the previous execution (single selected param)", () => {
      ps.subscribeToDiff("event_1", "all", (a, b) => {
         return [a];
      }, callback);

      ps.publish("event_1", 42, "yo"); // param gets registered for future comparison as execution actually takes place
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 42, "ya");
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 43, "ya"); // param gets registered for future comparison as execution actually takes place
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 43, "ya");
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 42, "ya"); // param gets registered for future comparison as execution actually takes place
      assert.equal(callback.callCount, 3);
   });

   it("Executes a registered callback only when ALL parameters passed to it have changed from the previous execution (multiple selected params)", () => {
      ps.subscribeToDiff("event_1", "all", (a, b) => {
         return [a, b];
      }, callback);

      ps.publish("event_1", 42, "yo"); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 42, "ya");
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 43, "ya"); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 42, "ya");
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 43, "yo");
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 43, "yo"); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 42, "yo"); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 3);
   });

   it("Executes a registered callback only when ANY parameter passed to it have changed from the previous execution (single selected param)", () => {
      ps.subscribeToDiff("event_1", "any", (a, b) => {
         return [a];
      }, callback);

      ps.publish("event_1", 42, "yo"); // param gets registered for future comparison as execution actually takes place
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 42, "ya");
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 43, "ya"); // param gets registered for future comparison as execution actually takes place
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 43, "ya");
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 42, "ya"); // param gets registered for future comparison as execution actually takes place
      assert.equal(callback.callCount, 3);
   });

   it("Executes a registered callback only when ANY parameter passed to it has change from the previous execution (multiple selected params)", () => {
      ps.subscribeToDiff("event_1", "any", (a, b) => {
         return [a, b];
      }, callback);

      ps.publish("event_1", 42, "yo"); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 42, "ya"); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 42, "ya");
      assert.equal(callback.callCount, 2);

      ps.publish("event_1", 42, "yo"); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 3);
   });

   it("Does not execute a registered callback when the only changed parameter is not among the selected ones (ANY operator)", () => {
      ps.subscribeToDiff("event_1", "any", (a, b, c) => {
         return [a, c];
      }, callback);

      ps.publish("event_1", 1, 2, 3); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 1, 100, 3);
      assert.equal(callback.callCount, 1);
   });

   it("Does not execute a registered callback when the only changed parameter is not among the selected ones (ALL operator)", () => {
      ps.subscribeToDiff("event_1", "all", (a, b, c) => {
         return [a, c];
      }, callback);

      ps.publish("event_1", 1, 2, 3); // params get registered as execution actually takes place
      assert.equal(callback.callCount, 1);

      ps.publish("event_1", 1, 100, 3);
      assert.equal(callback.callCount, 1);
   });

   it("Allows callbacks to be ONCEREGISTERED only once to a certain event (once cbs are stored in a Set)", () => {
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

   it("Executes the registered `once` callbacks only once [you don't say! 😄]", () => {
      ps.once("event_1", callback);
      ps.once("event_1", callback2);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(callback2.callCount, 1);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 1);
      assert.equal(callback2.callCount, 1);
   });

   it("Can asynchronously execute callbacks of an event when that event gets published", async () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_2", callback);

      await ps.publishAsync("event_1", 42);

      // wait a bit if publishAsync doesn't guarantee execution timing
      await new Promise((resolve) => {
         setTimeout(resolve, 10)
      });

      assert.equal(callback.callCount, 1);
      assert.equal(callback.getCall(0).args[0], "event_1");
      assert.equal(callback.getCall(0).args[1], 42);
   });

   it("Lets you unregister a callback from a particular event", () => {
      ps.subscribe("event_1", callback);
      ps.subscribe("event_2", callback);

      ps.unsubscribe("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
   });

   it("Lets you unregister a `once` callback from a particular event", () => {
      ps.once("event_1", callback);
      ps.once("event_2", callback);

      ps.unsubscribe("event_1", callback);

      ps.publish("event_1", 42);

      assert.equal(callback.callCount, 0);

      ps.publish("event_2", 42);

      assert.equal(callback.callCount, 1);
   });

   it("Lets you flush all callbacks registered to a certain event", () => {
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

   it("Lets you flush all callbacks registered to any event", () => {
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
