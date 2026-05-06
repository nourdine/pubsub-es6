import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

describe("LePubSub", () => {

   var ps;
   var callback;

   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
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
});
