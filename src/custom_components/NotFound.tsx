import React from "react";
import { Frown } from "lucide-react";

const NoResultsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-4xl text-gray-600 mb-4">
        <Frown size={64} />
      </div>
      <p className="text-2xl text-gray-700 mb-4">No Results Found</p>
      <p className="text-lg text-gray-500 mb-8">
        We couldn&apos;t find any matching results for your search.
      </p>
    </div>
  );
};

export default NoResultsFound;
