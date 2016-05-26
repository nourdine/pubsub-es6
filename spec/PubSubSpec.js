const assert = require("assert");
const PubSub = require("./../PubSub");

describe("PubSub", () => {

   var ps;

   beforeEach(() => {
      ps = PubSub.singleton();
   });

   it("has a singleton method that works", () => {
      assert(ps === PubSub.singleton());
      assert(ps !== new PubSub());
   });

   it("checks params when you subscribe", () => {
      assert.throws(() => {
         ps.subscribe(null, () => "");
      });
      assert.throws(() => {
         ps.subscribe("event_name", null);
      });
   });

   it("executes all the registered callbacks when publishing", () => {
      var n = 0;
      var cb = () => {
         n++;
      };      
      ps.subscribe("ev", cb);
      ps.subscribe("ev", cb);
      ps.publish("ev");      
      assert.equal(n, 2);
   });
});
