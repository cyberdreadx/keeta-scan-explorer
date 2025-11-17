import Header from "@/components/Header";
import LatestTransactions from "@/components/LatestTransactions";

const Transactions = () => {
  return (
    <>
      <Header />
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-foreground">All Transactions</h1>
          <LatestTransactions />
        </div>
      </div>
    </>
  );
};

export default Transactions;
