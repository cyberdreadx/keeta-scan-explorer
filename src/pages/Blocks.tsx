import Header from "@/components/Header";
import LatestBlocks from "@/components/LatestBlocks";

const Blocks = () => {
  return (
    <>
      <Header />
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-foreground">All Blocks</h1>
          <LatestBlocks />
        </div>
      </div>
    </>
  );
};

export default Blocks;
