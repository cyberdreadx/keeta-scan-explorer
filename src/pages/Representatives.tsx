import Header from "@/components/Header";
import RepresentativesList from "@/components/RepresentativesList";
import { useRepresentatives } from "@/hooks/useKeetaData";

const Representatives = () => {
  const { data: representatives = [] } = useRepresentatives();

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Representatives</h1>
        <RepresentativesList representatives={representatives} />
      </div>
    </>
  );
};

export default Representatives;
