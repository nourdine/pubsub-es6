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

   it("executes all and only the registered callbacks of a channel when that channel gets published", () => {
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
   
   it("can purge a whole channel", () => {
      var n = 0;
      var cb = () => {
         n++;
      };
      ps.subscribe("ch_1", cb);
      ps.subscribe("ch_2", cb);
      assert.equal(ps._subscribers.size, 2);
      ps.purge("ch_1");
      ps.publish("ch_1");
      assert.equal(n, 0);
      ps.publish("ch_2");
      assert.equal(n, 1);
      assert.equal(ps._subscribers.size, 1);
   });
});
