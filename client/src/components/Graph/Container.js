import React, { Component } from "react";
import axios from "axios";
import View from "./View";

export default class Container extends Component {

    static colorMap = {
        "1": "red",
        "2": "green",
        "3": "orange",
        "4": "purple",
        "5": "blue",
    }

    static displayName = "GraphContainer"

    state = { isLoading: false, errorMessage: "", data: [] };

    get datasets() {

        const { data } = this.state;

        return data.reduce((total, { coordinates, meta: { group } }) => {

            total.data.push(coordinates);
            total.backgroundColor.push(Container.colorMap[group]);

            return total;
        }, {data: [], backgroundColor: [], label: "Prices"})
    }
    
    async componentDidMount() {
        const newState = { isLoading: true, errorMessage: "", data: [] };

        try {
            this.setState(newState);

            const { data } = await axios({
                method: "get",
                url: "https://sold-price-map-data-technical-challenge.s3-eu-west-1.amazonaws.com/sold-price-map-data-technical-challenge-transformed.json",
                mode: "no-cors"
            })

            newState.data = data;

        } catch (error) {
            newState.errorMessage = "An error has occured please reload."
        } finally {
            newState.isLoading = false
            this.setState(newState);
        }
    }

    render() {
        const { isLoading, errorMessage } = this.state;

        if(isLoading) {
            return <div>Loading...</div>
        }

        if(errorMessage) {
            return <div>{errorMessage}</div>
        }

        return (
            <View datasets={this.datasets} />
        )
    }
}