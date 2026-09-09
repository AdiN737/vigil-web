import Hero from "./components/Hero";
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
