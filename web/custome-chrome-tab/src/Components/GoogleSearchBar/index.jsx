/* eslint-disable react/prop-types */
import React from "react";

function GoogleSearchBar({ textClass, inputClass, buttonClass }) {
  return (
    <div className="flex items-center justify-center m-5 p-5">
      <div className="text-center">
        <h1 className={`${textClass} text-4xl font-bold mb-8`}>Google</h1>

        <form
          className="flex items-center w-full max-w-xl shadow-lg rounded-full overflow-hidden"
          action="https://www.google.com/search"
          method="GET"
          target="_blank"
        >
          <input
            type="text"
            name="q"
            placeholder="Search Google"
            className={`w-full px-6 py-3 text-lg border-none focus:ring-0 focus:outline-none ${inputClass}`}
            required
          />
          <button
            type="submit"
            className={`px-6 py-3 text-lg font-medium hover:bg-opacity-90 focus:outline-none ${buttonClass}`}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default GoogleSearchBar;
