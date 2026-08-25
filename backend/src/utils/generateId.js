const generateId = (prefix, number) =>
{
    return `${prefix}${String(number).padStart(4, "0")}`;
};

module.exports = generateId;