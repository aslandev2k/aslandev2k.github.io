import type { Tree } from '../data/content.ts'

export function TreeFigure({ tree }: { tree: Tree }) {
  const lastIndex = tree.branches.length - 1

  return (
    <figure className="tree">
      <figcaption>{tree.caption}</figcaption>
      <div className="tree-root">
        <span>{tree.root}</span>
        <small>{tree.rootNote}</small>
      </div>
      <ul>
        {tree.branches.map((branch, index) => (
          <li key={branch.name}>
            <span className="tree-glyph" aria-hidden="true">
              {index === lastIndex ? '└─' : '├─'}
            </span>
            <span className="tree-name">{branch.name}</span>
            <span className="tree-detail">{branch.detail}</span>
          </li>
        ))}
      </ul>
      <p>{tree.footnote}</p>
    </figure>
  )
}
