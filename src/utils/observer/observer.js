export class Observer {
    constructor(uuid) {
        if (new.target === Observer) {
            throw new TypeError("Must not instantiate directly");
        }
        this._uuid = uuid;
        if (this.notify === undefined) {
            throw new TypeError("Must override the observer notification");
        }
    }

    get uuid() {
        return this._uuid;
    }
}