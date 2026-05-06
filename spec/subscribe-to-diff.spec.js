import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import sinon from "sinon";
import LePubSub from "../src/le-pub-sub.js";

describe("LePubSub (subscribeToDiff)", () => {

   var ps;
   var callback;
   
   beforeEach(() => {
      ps = new LePubSub();
      callback = sinon.spy();
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
});
