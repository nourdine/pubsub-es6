const assert = require("assert");
const PubSub = require("./../PubSub");

describe("PubSub", () => {

   var ps;

   beforeEach(() => {
      ps = new PubSub();
   });

   it("has a singleton method that works", () => {
      assert(PubSub.singleton() === PubSub.singleton());
   });

   it("executes all the registered callbacks when an event gets published", () => {
      var n = 0;
      var cb = () => {
         n++;
      };
      ps.subscribe("ev_1", cb);
      ps.subscribe("ev_1", cb);
      ps.subscribe("ev_2", cb);
      ps.publish("ev_1");
      assert.equal(n, 2);
   });
   
   it("unregisters a callback from a particular event when asked to", () => {
      var n = 0;
      var cb = () => {
         n++;
      };
      ps.subscribe("ev_1", cb);
      ps.subscribe("ev_1", cb);
      ps.subscribe("ev_2", cb);
      ps.unsubscribe("ev_1", cb);
      ps.publish("ev_1");
      assert.equal(n, 0);
      ps.publish("ev_2");
      assert.equal(n, 1);
   });
});
