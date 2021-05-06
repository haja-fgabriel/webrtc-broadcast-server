export class Observer {
    constructor(uuid) {
        this._uuid = uuid;
        if (this.notify === undefined) {
            throw new TypeError("Must override the observer notification");
        }
    }

    get uuid() {
        return this._uuid;
    }
}