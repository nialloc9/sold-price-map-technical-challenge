import React from "react";
import styled from "@emotion/styled";
import { Scatter } from 'react-chartjs-2';

const Wrapper = styled.div`
    margin: 100px auto;
    border: 1px solid black;
    min-height: 400px;
    max-width: 800px;
    padding: 20px;
`;

const Item = styled.li`
    list-style: none;
    color: white;
    border: 1px solid black;
    background-color: ${({ color }) => color};
    margin: 5px;
    padding: 5px;

   
    @media only screen and (min-width: 600px) {
        display: inline;
        margin: 0 5px;
        padding: 5px;

        :first-child {
            margin: 0;
        }
    }

    
`;

const percentiles = [
    {
        value: "0% - 5%",
        color: "red"
    },
    {
        value: "5% - 25%",
        color: "green"
    },
    {
        value: "25% - 75%",
        color: "orange"
    },
    {
        value: "75% - 95%",
        color: "purple"
    },
    {
        value: "95% - 100%",
        color: "blue"
    }
]

const View = ({ datasets }) => {
    return (
        <Wrapper>
            <Scatter data={{datasets: [datasets]}} />
            <ul>
                {percentiles.map(({ value, color }) => <Item color={color}>{value}</Item>)}
            </ul>
        </Wrapper>
    )
}

View.displayName = "GraphView";

export default View;