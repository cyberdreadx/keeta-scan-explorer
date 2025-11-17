import Header from "@/components/Header";
import LatestBlocks from "@/components/LatestBlocks";

const Blocks = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">All Blocks</h1>
        <LatestBlocks />
      </div>
    </>
  );
};

export default Blocks;
