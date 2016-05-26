const assert = require("assert");
const PubSub = require("./../PubSub");

describe("PubSub", function() {
   
   var ps;
   
   beforeEach(function() {
      ps = PubSub.singleton();
   });
  
   it("has a singleton method that works", function () {
      assert(ps === PubSub.singleton());
      assert(ps !== new PubSub());
   });
});
