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

    notify(uuid, message, ...args) {
        if (this._observers.get(uuid) === undefined) {
            throw new Error()
        }
        this._observers.get(uuid).notify(message, ...args);
    }

    get observers() {
        return new Map(this._observers);
    }
}