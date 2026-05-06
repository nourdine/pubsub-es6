import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

describe("LePubSub (reset)", () => {

   var ps;
   var callback;

   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
   });

   it("Lets you reset all callbacks registered to any event", () => {
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
