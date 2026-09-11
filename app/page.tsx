import Hero from "./components/Hero";
import Stage from "./components/Stage";
import Quiet from "./components/Quiet";
import Agents from "./components/Agents";
import Install from "./components/Install";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Stage />
        <Quiet />
        <Agents />
        <Install />
      </main>
      <Footer />
    </>
  );
}
