import { useState } from "react";
import { Input, Button, DivButton, Container } from "../src/styles/styles";
import Image from "next/image";
import Logo from "../src/img/Logo.png";
import Search from "../src/img/search_icon.png";

export default function Home() {
  const [user, setUser] = useState("");
  return (
    <Container>
     
      <Image src={Logo} alt="IF VSCO DISAPPEAR" width={500} height={80} />
      <DivButton>
        <form method="POST" action="/api/vsco">
          <Input
            placeholder="Usuário do VSCO"
            name="username"
            onChange={(e) => setUser(e.target.value)}
          ></Input>
          <Button style={{ cursor: "pointer" }}type="submit">
            {" "}
            <Image
              src={Search}
              alt="IF VSCO DISAPPEAR"
             
            />
          </Button>
        </form>
      </DivButton>
    </Container>
  );
}
