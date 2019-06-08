const types = {

    string(value) {
        if (typeof value === 'string')
            return value;
        return JSON.stringify(value);
    },
    number(value) {
        if (typeof value === 'number')
            return value;
        return Number(value);
    },
    boolean(value) {
        if (typeof value === 'boolean')
            return value;
        else if (value === 'true' || value === 1)
            return true;
        else if (value === 'false' || value === 0)
            return false;
        else {
            return !!value;
        }
    },
    object(value) {
        if (typeof value === 'object' && value)
            return value;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    },
    array(value) {
        return this.object(value);
    },
    date(value) {
        if (value instanceof Date)
            return value;
        else
            return new Date(value);
    }

};

module.exports = function castType(value, type) {
    if (types[type] !== undefined) {
        value = types[type](value);
    }
    return value;
};