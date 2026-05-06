import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

describe("LePubSub (flush)", () => {

   var ps;
   var callback;

   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
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
});
