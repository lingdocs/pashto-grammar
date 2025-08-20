import type { JSX } from "react";
import Link from "../components/Link";
import Footer from "../components/Footer";

const content: {
  title: string,
  subTitle: string,
  description: string,
  linkDescription: string | JSX.Element,
  link: string,
}[] = [
    {
      title: "Read the Reference 📚",
      subTitle: "Language Docs",
      description: "Browse the reference to see how different elements of the language work, and how they interact with each other to build phrases. Look up whatever you need explanations for.",
      link: "/table-of-contents",
      linkDescription: "Table of Contents",
    },
    {
      title: "Play Games 🎮",
      subTitle: "Grammar Quizzes",
      description: "Try to complete all the games to master the different elements of Pashto grammar: inflection, phrase building, verbs, etc. Learn the patterns of the language—how words and phrases form—through practice.",
      link: "/games",
      linkDescription: "Games Index",
    },
    {
      title: "Watch Videos 📺",
      subTitle: "LingDocs YouTube",
      description: "Watch explanainer videos about different grammar topis, and see how you can use the phrase engine to play around with sentences",
      link: "https://www.youtube.com/channel/UC1-yjDec5VDtia5s1gcMw4A",
      linkDescription: "LingDocs YouTube Channel",
    },
    {
      title: "Experiment with the Phrase Builder 🧪",
      subTitle: "Interactive Phrase Structure Analysis",
      description: "Build your own phrases in the interactive phrase builder. See how the words change and interact as you explore different tenses and forms.",
      link: "/phrase-builder/",
      linkDescription: "Phrase Builder",
    },
  ];

const LandingPage = () => {
  //   function handleShare() {
  //     if (!navigator.share) {
  //       // should be impossible
  //       alert("Sorry, Sharing links are not supported on your device.");
  //       return;
  //     }
  //     navigator.share && navigator.share({
  //       title: "LingDocs Pashto Grammar",
  //       url: "https://grammar.lingdocs.com",
  //     });
  //   }
  return <>
    <main className="col bg-faded py-3 d-flex flex-column">
      <h1>LingDocs Pashto Grammar</h1>
      <p className="lead">Explore the wonderful language of Pashto</p>
      {content.map((block) => (
        <Link key={block.link} to={block.link} className="plain-link">
          <div className="card clickable my-2 plain-link" style={{ maxWidth: "600px" }}>
            <div className="card-body">
              <h2 className="card-title">{block.title}</h2>
              <h5 className="card-subtitle mb-2 text-muted">{block.subTitle}</h5>
              <p className="card-text mb-4">{block.description}</p>
            </div>
          </div>
        </Link>
      ))}
      {/* //
        @ts-ignore */}
      <Footer />
    </main>
  </>;
};

export default LandingPage;
