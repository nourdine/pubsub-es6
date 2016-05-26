let instance;

class PubSub {
    
    static singleton() {
        if (!instance) { 
            instance = new PubSub();
        }
        return instance;
    }
    
    constructor() {
        this.subscribers = new Map();
    }
    
    subscribe(event, callback) {
        if (typeof event !== "string") {
            throw "event must be string";
        }
        if (typeof callback !== "function") {
            throw "callback must be function";
        }
        if (!this.subscribers.get(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event).push(callback);
    }
    
    publish(event, ...data) {
        var cbs = this.subscribers.get(event);
        if (cbs) {
            cbs.forEach((cb) => {
                cb.apply(null, data);
            });
        }
    }
}

module.exports = PubSub;