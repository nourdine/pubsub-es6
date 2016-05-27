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
     * @param channel String
     * @param callback Function 
     */
    subscribe(channel, callback) {
        if (!this._subscribers.get(channel)) {
            this._subscribers.set(channel, []);
        }
        this._subscribers.get(channel).push(callback);
    }

    /**
     * @param channel String
     * @param callback Function 
     */
    unsubscribe(channel, callback) {
        var cbs = this._subscribers.get(channel),
            filtered;
        if (cbs) {
            filtered = cbs.filter((cb) => {
                return cb !== callback;
            });
        }
        this._subscribers.set(channel, filtered);
    }

    /**
     * @param channel String
     * @param data Rest
     */
    publish(channel, ...data) {
        var cbs = this._subscribers.get(channel);
        if (cbs) {
            cbs.forEach((cb) => {
                cb.apply(null, data);
            });
        }
    }

    /**
     * @param channel String
     */
    purge(channel) {
        this._subscribers.delete(channel);
    }
}

module.exports = PubSub;