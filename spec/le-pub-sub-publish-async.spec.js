import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

describe("LePubSub (publishAsync)", () => {

   var ps;
   var callback;

   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
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
});
