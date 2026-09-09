import Hero from "./components/Hero";
import Stage from "./components/Stage";
import Try from "./components/Try";
import SeeIt from "./components/SeeIt";
import Quiet from "./components/Quiet";
import States from "./components/States";
import Agents from "./components/Agents";
import Install from "./components/Install";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Stage />
        <Try />
        <SeeIt />
        <Quiet />
        <States />
        <Agents />
        <Install />
      </main>
      <Footer />
    </>
  );
}
