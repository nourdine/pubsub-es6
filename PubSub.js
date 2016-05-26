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
        if (!this.subscribers.get(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event).push(callback);
    }
    
    publish(event) {
        
    }
}

module.exports = PubSub;