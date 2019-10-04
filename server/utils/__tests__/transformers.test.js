const { sortByPrice,  convertToApplicationDataStructure} = require("../transformers")

describe("transformer tests", () => {

    it("should convert to correct data structure", () => {

        const data = "1 1 10";

        const expectedData = { coordinates: { x: "1", y: "1" }, price: { currency: "£", value: "10" } };

        expect(convertToApplicationDataStructure(data)).toStrictEqual(expectedData)
    })

    it("should sort by price", () => {
        const data = [{price: { value: 10 }}, {price: { value: 5 }}]

        expect(sortByPrice(data)).toStrictEqual([{price: { value: 5 }}, {price: { value: 10 }}])
    })
})