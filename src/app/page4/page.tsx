"use client";
import React from "react";
import styled from "@emotion/styled";
import QuoteApp from "./src/vertical/quote-app";
import { getQuotes } from "./src/data";
import { grid } from "./src/constants";

const ScrollContainer = styled.div`
  box-sizing: border-box;
  background: lightgrey;
  padding: ${grid * 2}px;
  overflow-y: scroll;
  width: 500px;
  height: 100vh;
  position: relative;
`;

const Title = styled.h4`
  text-align: center;
  margin-bottom: ${grid}px;
`;

export default function Page4() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Drag and Drop Examples</h1>

      <div style={{ marginBottom: "40px" }}>
        <h2>Basic Example</h2>
        <QuoteApp initial={getQuotes()} />
      </div>
    </div>
  );
}
