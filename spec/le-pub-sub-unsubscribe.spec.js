import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

describe("LePubSub (unsubscribe)", () => {

   var ps;
   var callback;

   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
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
});
