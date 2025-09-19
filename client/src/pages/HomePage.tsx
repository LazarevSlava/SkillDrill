import { useCallback, useState } from "react";
import Header from "../components/Header";
import Main from "../components/Main";

export default function HomePage() {
  const [, setOpenSignup] = useState(false);
  const [, setOpenLogin] = useState(false);

  const handleOpenSignup = useCallback(() => setOpenSignup(true), []);
  const handleOpenLogin = useCallback(() => setOpenLogin(true), []);

  return (
    <>
      <Header onOpenSignup={handleOpenSignup} onOpenLogin={handleOpenLogin} />
      <Main onOpenSignup={handleOpenSignup} />
    </>
  );
}
