/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from "react-router-dom";
import leftChevron from "./chevron_left-24px.svg";
import rightChevron from "./chevron_right-24px.svg";

function Footer({ chapter }) {
    function Chevron({dir, label}) {
      function Label({text}) {
        return <span className="text-muted">
          {text}
        </span>;
      }
      return (
        <div className="link-unstyled">
          <Link to={chapter[dir].path}>
            <div className="link-unstyled d-flex flex-row align-items-center">
              {dir === "next" && <Label text={label} />}
              <img 
                src={dir === "prev" ? leftChevron : rightChevron} style={{
                  height: "2rem",
                  width: "2rem",
                }}
                alt={dir === "prev" ? "previous" : "next"}
              />
              {dir === "prev" && <Label text={label} />}
            </div>
          </Link>
        </div>
      );
    }
    return (
      <footer className="footer mt-auto pb-2">
        <div className="copyright text-muted my-4 text-center">
          <small>© <a rel="author" href="https://www.lingdocs.com/">lingdocs.com</a> {new Date().getFullYear()} - <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> - <a href="https://github.com/lingdocs/pashto-grammar">source</a></small>
        </div>
        {chapter &&
            <div className="d-flex justify-content-between">
            {["prev", "next"].map((dir) => (
                <div key={dir}>
                {chapter[dir] && <Chevron dir={dir} label={chapter[dir].frontMatter.title} />}
                </div>
            ))}
            </div>
        }
      </footer>
    );
}

export default Footer;