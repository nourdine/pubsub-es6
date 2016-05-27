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
     * @param channel String
     * @param callback Function 
     */
    subscribe(channel, callback) {
        this._subscribe(channel, callback, false);
    }

    /**
     * @param channel String
     * @param callback Function 
     */
    once(channel, callback) {
        this._subscribe(channel, callback, true);
    }

    /**
     * @param channel String
     * @param callback Function 
     */
    unsubscribe(channel, callback) {
        var cbs = this._subscribers.get(channel),
            oncers = this._oncers.get(channel),
            filtered;
        if (cbs) {
            filtered = cbs.filter((cb) => {
                return cb !== callback;
            });
            this._subscribers.set(channel, filtered);
        }
        if (oncers) {
            filtered = oncers.filter((cb) => {
                return cb !== callback;
            });
            this._oncers.set(channel, filtered);
        }
    }

    /**
     * @param channel String
     * @param data Rest
     */
    publish(channel, ...data) {
        var cbs = this._subscribers.get(channel),
            oncers = this._oncers.get(channel);
        if (cbs) {
            cbs.forEach((cb) => {
                cb.apply(null, data);
            });
        }
        if (oncers) {
            oncers.forEach((cb) => {
                cb.apply(null, data);
            });
            this._oncers.delete(channel);
        }
    }

    /**
     * @param channel String
     */
    purge(channel) {
        this._subscribers.delete(channel);
        this._oncers.delete(channel);
    }

    _subscribe(channel, callback, once) {
        var subscribers = once ? this._oncers : this._subscribers;
        if (!subscribers.get(channel)) {
            subscribers.set(channel, []);
        }
        subscribers.get(channel).push(callback);
    }
}

module.exports = PubSub;