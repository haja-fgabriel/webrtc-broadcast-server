import { Observer } from "./observer";

export class Observable {
    constructor() {
        this._observers = new Map();
    }

    /**
     * Adds an observer to the observable.
     * @param {string} uuid 
     * @param {Observer} observer 
     */
    addObserver(uuid, observer) {
        this._observers.set(uuid, observer);
    }

    /**
     * Removes an observer.
     * @param {string} uuid 
     */
    removeObserver(uuid) {
        this._observers.delete(uuid);
    }

    /**
     * Notifies the observer with the given UUID.
     * @param {string} uuid 
     * @param {string} message 
     * @param  {...any} args 
     */
    notify(uuid, message, ...args) {
        if (this._observers.get(uuid) === undefined) {
            throw new Error('No observer defined with UUID ' + uuid);
        }
        this._observers.get(uuid).notify(message, ...args);
    }

    get observers() {
        return new Map(this._observers);
    }
}