class LePubSub {

   static #instance;

   #oncers;
   #subscribers;

   /**
    * @returns {LePubSub}
    */
   static singleton() {
      if (!LePubSub.#instance) {
         LePubSub.#instance = new LePubSub();
      }
      return this.#instance;
   }

   constructor() {
      this.#oncers = new Map();
      this.#subscribers = new Map();
   }

   /**
    * Count the number of subscribers (callbacks) registered to a certain event.
    * 
    * @param {String} event 
    * @returns {Number}
    */
   countSubscribers(event) {
      var s = this.#subscribers.get(event)
      return s ? s.size : 0;
   }

   /**
    * Count the number of oncers (callbacks) registered to a certain event.
    * 
    * @param {String} event 
    * @returns {Number}
    */
   countOncers(event) {
      var o = this.#oncers.get(event)
      return o ? o.size : 0;
   }

   /**
    * Register a callback to a certain event.
    * 
    * @param {String} event
    * @param {Function} callback
    */
   subscribe(event, callback) {
      this.#checkParams(event, callback);
      this.#register(event, callback, false);
   }

   /**
    * Register a callback to a certain event which will only be executed if the passed params has changed from the previous execution.
    * 
    * @param {String} event 
    * @param {Function} selector A function that selects which params should be compared with the ones provided in the previous execution
    * @param {String} operator The operator ("any" OR "all") to use in oder to evaluate the two sets of values (the current ones and the ones from the previous execution)
    * @param {Function} callback
    * @returns {Function} The closure wrapping the original callback. To be used to unregister from the event.
    */
   subscribeToDiff(event, operator, selector, callback) {
      var previous;

      if (["any", "all"].indexOf(operator) == -1) {
         throw new Error("Invalid operator. Only `any` and `all` are permitted.");
      }

      const comparator = operator == "any" ? anyChanged : allChanged;

      const f = (...args) => {
         const payload = args.slice(1);
         const selected = selector(...payload);

         if (comparator(selected, previous)) {
            previous = selected;
            callback(...selected);
         }
      }

      this.subscribe(event, f);
      return f;
   }

   /**
    * Register a callback to a certain event.
    * The callback will only be executed at the first event issue.
    * 
    * @param {String} event
    * @param {Function} callback
    */
   once(event, callback) {
      this.#checkParams(event, callback);
      this.#register(event, callback, true);
   }

   /**
    * Unsubscribe a callback from a certain event.
    * 
    * @param {String} event
    * @param {Function} callback
    */
   unsubscribe(event, callback) {
      var cbs = this.#subscribers.get(event),
         oncers = this.#oncers.get(event);
      if (cbs) {
         cbs.delete(callback);
      }
      if (oncers) {
         oncers.delete(callback);
      }
   }

   /**
    * Publish a certain event along with its payload.
    * 
    * @param {String} event
    * @param {Rest} data
    */
   publish(event, ...data) {
      this.#notify(event, data, false);
   }

   /**
    * Asynchronously publish a certain event along with its payload.
    * 
    * @param {String} event
    * @param {Rest} data
    */
   publishAsync(event, ...data) {
      this.#notify(event, data, true);
   }

   /**
    * Remove all the callbacks registered to a certain event. 
    *
    * @param {String} event
    */
   flush(event) {
      this.#subscribers.delete(event);
      this.#oncers.delete(event);
   }

   /**
    * Remove any possible callback ever registered to any event. Total flush!
    */
   reset() {
      this.#subscribers.clear();
      this.#oncers.clear();
   }

   #checkParams(event, callback) {
      if (typeof event !== "string") {
         throw "The event name must be a string";
      }
      if (typeof callback !== "function") {
         throw "The callback must be a function";
      }
   }

   #register(event, callback, once) {
      var subscribers = once ? this.#oncers : this.#subscribers;
      if (!subscribers.get(event)) {
         subscribers.set(event, new Set());
      }
      subscribers.get(event).add(callback);
   }

   #notify(event, data, async) {
      data = [event, ...data];
      var subscribers = this.#subscribers.get(event),
         oncers = this.#oncers.get(event);

      const exec = () => {
         if (subscribers) {
            [...subscribers] // array containing the elements of the set (snapshot)
               .forEach((subscriber) => {
                  subscriber.apply(null, data);
               });
         }
         if (oncers) {
            [...oncers] // array containing the elements of the set (snapshot)
               .forEach((oncer) => {
                  oncer.apply(null, data);
               });
            this.#oncers.delete(event);
         }
      }

      async ? setTimeout(exec, 1) : exec()
   }
}

function allChanged(selected, previous) {
   if (!previous) return true;
   if (selected.length !== previous.length) return true;

   for (let i = 0; i < selected.length; i++) {
      if (selected[i] === previous[i]) {
         return false;
      }
   }

   return true;
}

function anyChanged(a, b) {
   if (a === b) return false;
   if (!a || !b) return true;
   if (a.length !== b.length) return true;

   for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return true;
   }

   return false;
}

export default LePubSub;