import Header from "@/components/Header";
import LatestTransactions from "@/components/LatestTransactions";

const Transactions = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">All Transactions</h1>
        <LatestTransactions />
      </div>
    </>
  );
};

export default Transactions;
