import Link from "../components/Link";
import Footer from "../components/Footer";
import algoliasearch from "algoliasearch";
import { useEffect, useState } from "react";
import { createSearchParams, useSearchParams } from "react-router-dom";

const client = algoliasearch(
  process.env.ALGOLIA_GRAMMAR_APP_ID || "",
  process.env.ALGOLIA_GRAMMAR_API_KEY || "",
);
const index = client.initIndex(process.env.ALGOLIA_GRAMMAR_INDEX || "");

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[] | "searching" | "none">([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const inParams = searchParams.get("search");
    if (inParams) {
      setSearch(inParams);
      doSearch(inParams);
    } else {
      setResults([]);
      setSearch("");
    }
  }, [window.location.search]);
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!search) return;
    setSearchParams(createSearchParams({
      search,
    }));
    doSearch(search);
  }
  function doSearch(s: string) {
    setResults("searching");
    index.search(s, {
      attributesToSnippet: [
        "content:30",
      ],
      highlightPreTag: '<strong class="search-highlight">',
      highlightPostTag: '</strong>'
    }).then(({ hits }) => {
      setResults(hits.length ? hits : "none");
    }).catch(e => {
      console.error(e);
      alert("Connect to the internet to search");
    });
  }
  return <>
    <main className="col bg-faded py-3 d-flex flex-column" style={{ maxWidth: "800px" }}>
        <h1>Search</h1>
        <form className="input-group mb-3 mt-2" onSubmit={handleSearch}>
          <input
            className="form-control"
            placeholder="Search in grammar..."
            type="text"
            onChange={e => setSearch(e.target.value)}
            value={search}
          />
          <div className="input-group-append">
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
          </div>
        </form>
        {results === "none"
          ? <h5>No results found</h5>
          : results === "searching"
          ? <p>Searching...</p>
          : <>
          {results.length > 0 && <div className="text-muted small mb-3">{`${results.length} result${results.length > 1 ? "s" : ""}`}</div>}
          {results.map(result => <div className="link-unstyled mb-4">
            <Link to={result.url}>
              <div>
                <h5>{getHiearchy(result.hierarchy)}</h5>
                <div
                  dangerouslySetInnerHTML={{__html: result._snippetResult.content.value }}
                />
              </div>
            </Link>
          </div>)}
        </>}
        {/*
        @ts-ignore */}
        <Footer />
    </main>
  </>;
};

function getHiearchy(s: any): string {
  const levels: string[] = [s.lvl0];
  for (let i = 1; i < 6; i++) {
    const key = `lvl${i}`;
    if (s[key]) {
      levels.push(s[key]);
    } else break;
  }
  return levels.join(" • ");
}

export default SearchPage;
