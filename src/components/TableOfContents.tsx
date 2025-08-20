import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';
import type { TOCData } from '../content';

function TableOfContents({ tableOfContents }: { tableOfContents: TOCData }) {
  return (
    <nav className="table-of-contents col-3 col-xl-4 text-muted mx-3 my-3">
      <Scrollspy items={tableOfContents.map(x => x.id)} currentClassName="is-current">
        {tableOfContents.map(item => {
          if (item.depth === 2) return (
            <div key={item.id} className="table-of-contents-item">
              <div className="link-unstyled pb-2">
                <NavHashLink smooth to={`#${item.id}`}>{item.value}</NavHashLink>
              </div>
              {item.children?.map(child => {
                if (child.depth === 3) return (
                  <div className="link-unstyled ml-2 pb-1" key={child.id}>
                    <small>
                      <NavHashLink smooth to={`#${child.id}`}>
                        {child.value}
                      </NavHashLink>
                    </small>
                  </div>
                );
                else return undefined;
              })}
            </div>
          )
          else {
            return null;
          }
        })}
      </Scrollspy>
    </nav>
  );
}

export default TableOfContents;
