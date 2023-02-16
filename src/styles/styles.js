import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    position: absolute;
    top: 10vh;
  }
`;

export const Input = styled.input`
  width: 500px;
  height: 60px;
  border: 4px solid #000;
  border-radius: 6px;
  font-size: 1.2em;
  padding: 6px;
  padding-right: 80px;
  position: relative;
  @media (max-width: 1100px) {
   width: 400px;
  }
  @media (max-width: 420px) {
    width: 240px;
   }
`;

export const Button = styled.button`
  width: 72px;
  height: 60px;
  background-color: #000;
  border-radius: 6px;
  position: absolute;
  right: 0;
  img {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
  }
  @media (max-width: 1000px) {
    width: 60px;
  }
  @media (max-width: 420px) {
    width: 40px;
   }
`;

export const DivButton = styled.div`
  width: 500px;
  height: 60px;
  position: relative;
  @media (max-width: 1100px) {
    width: 400px;
   }
   @media (max-width: 420px) {
    width: 240px;
   }
`;
