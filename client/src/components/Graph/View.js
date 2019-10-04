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

const View = ({ datasets }) => {
    return (
        <Wrapper>
            <Scatter data={{datasets: [datasets]}} />
        </Wrapper>
    )
}

View.displayName = "GraphView";

export default View;