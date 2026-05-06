import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

describe("LePubSub (subscribe)", () => {

   var ps;
   var callback;
   var callback2;

   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
      callback2 = sinon.spy();
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
});
