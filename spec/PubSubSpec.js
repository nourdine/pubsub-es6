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

   it("executes all the registered callbacks when an channel gets published", () => {
      var n = 0;
      var cb = () => {
         n++;
      };
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_2", cb);
      ps.publish("ch_1");
      assert.equal(n, 2);
   });
   
   it("unregisters a callback from a particular channel when asked to", () => {
      var n = 0;
      var cb = () => {
         n++;
      };
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_2", cb);
      ps.unsubscribe("ch_1", cb);
      ps.publish("ch_1");
      assert.equal(n, 0);
      ps.publish("ch_2");
      assert.equal(n, 1);
   });
});
