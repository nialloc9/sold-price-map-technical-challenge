/**
 * @description converts string to application data structure
 */
module.exports.convertToApplicationDataStructure = line => {

    const [x, y, price] = line.split(" ");

    return { coordinates: { x, y }, price: { currency: "£", value: price } };
}

module.exports.sortByPrice = data => data.sort(({ price: { value: a } }, { price: { value: b } }) => a - b);

/**
 * @description assigns meta data to each object 
 */
module.exports.assignMeta = data => {

    const calcPercentile = length => (prev, percentage) => length * percentage + prev;

    const percentile = calcPercentile(data.length);

    const firstPercentile = percentile(0, 0.05);
    const secondPercentile = percentile(firstPercentile, 0.2);
    const thirdPercentile = percentile(secondPercentile, 0.5);
    const fourthPercentile = percentile(thirdPercentile, 0.2)
    const fifthPercentile = percentile(fourthPercentile, 0.05);
    
    return data.reduce((total, curr, index) => {
        curr.meta = {};

        switch(true) {
            case index + 1 <= firstPercentile:
                curr.meta.group = 1;
                break;
            case index + 1 <= secondPercentile:
                curr.meta.group = 2;
                break;
            case index + 1 <= thirdPercentile:
                curr.meta.group = 3;
                break;
            case index + 1 <= fourthPercentile:
                curr.meta.group = 4;
                break;
            case index + 1 <= fifthPercentile:
                curr.meta.group = 5;
                break;
        }
        
        total.push(curr);

        return total;
    }, [])
}

/**
 * @description loops through each transformer passing result to each
 */
module.exports.pipeline = (data, transformers) => transformers.reduce((total, curr) => {
    total = curr(total)
    return total;
}, data)