import SearchBar from "@/components/base/search-bar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="grid h-3/4 w-full max-w-md justify-items-center">
      <header className="flex flex-col items-center">
        <Image src="/itunes-logo.png" alt="iTunes Logo" width={75} height={75} />
        <h1 className="text-3xl font-bold">iTunes</h1>
      </header>

      <SearchBar />
    </main> 
  );
}
