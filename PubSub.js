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
        this._subscribers = new Map();
    }

    /**
     * @param event String
     * @param callback Function 
     */
    subscribe(event, callback) {
        if (!this._subscribers.get(event)) {
            this._subscribers.set(event, []);
        }
        this._subscribers.get(event).push(callback);
    }

    /**
     * @param event String
     * @param callback Function 
     */
    unsubscribe(event, callback) {
        var cbs = this._subscribers.get(event),
            filtered;
        if (cbs) {
            filtered = cbs.filter((cb) => {
                return cb !== callback;
            });
        }
        this._subscribers.set(event, filtered);
    }

    /**
     * @param event String
     * @param data Rest
     */
    publish(event, ...data) {
        var cbs = this._subscribers.get(event);
        if (cbs) {
            cbs.forEach((cb) => {
                cb.apply(null, data);
            });
        }
    }
}

module.exports = PubSub;