let instance;

class PubSub {

   /**
    * @return PubSub
    */
   static singleton() {
      if (!instance) {
         instance = new PubSub();
      }
      return instance;
   }

   constructor() {
      this._oncers = new Map();
      this._subscribers = new Map();
   }

   /**
    * @param event String
    * @param callback Function 
    */
   subscribe(event, callback) {
      if (typeof event === "string") {
         this._subscribe(event, callback, false);
      } else if (Array.isArray(event)) {
         event.forEach((e) => {
            this._subscribe(e, callback, false);
         });
      }
   }

   /**
    * @param event String
    * @param callback Function 
    */
   once(event, callback) {
      if (typeof event === "string") {
         this._subscribe(event, callback, true);
      } else if (Array.isArray(event)) {
         event.forEach((e) => {
            this._subscribe(e, callback, true);
         });
      }
   }

   /**
    * @param event String
    * @param callback Function 
    */
   unsubscribe(event, callback) {
      var cbs = this._subscribers.get(event),
         oncers = this._oncers.get(event),
         filtered;
      if (cbs) {
         filtered = cbs.filter((cb) => {
            return cb !== callback;
         });
         this._subscribers.set(event, filtered);
      }
      if (oncers) {
         filtered = oncers.filter((cb) => {
            return cb !== callback;
         });
         this._oncers.set(event, filtered);
      }
   }

   /**
    * @param event String
    * @param data Rest
    */
   publish(event, ...data) {
      data.unshift(event);
      var cbs = this._subscribers.get(event),
         oncers = this._oncers.get(event);
      if (cbs) {
         cbs.forEach((cb) => {
            cb.apply(null, data);
         });
      }
      if (oncers) {
         oncers.forEach((cb) => {
            cb.apply(null, data);
         });
         this._oncers.delete(event);
      }
   }

   /**
    * @param event String
    */
   flush(event) {
      this._subscribers.delete(event);
      this._oncers.delete(event);
   }

   _subscribe(event, callback, once) {
      var subscribers = once ? this._oncers : this._subscribers;
      if (!subscribers.get(event)) {
         subscribers.set(event, []);
      }
      subscribers.get(event).push(callback);
   }
}

module.exports = PubSub;