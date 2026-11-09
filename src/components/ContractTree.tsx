const branches = [
  { glyph: '├─', name: 'client', detail: 'ReactJS compiles against it' },
  { glyph: '├─', name: 'routes', detail: 'ExpressJS compiles against it' },
  { glyph: '└─', name: 'docs', detail: 'OpenAPI generated from it' },
]

export function ContractTree() {
  return (
    <figure className="tree">
      <figcaption>One API definition, three consumers</figcaption>
      <div className="tree-root">
        <span>contract</span>
        <small>ts-rest + Zod</small>
      </div>
      <ul>
        {branches.map((branch) => (
          <li key={branch.name}>
            <span className="tree-glyph" aria-hidden="true">
              {branch.glyph}
            </span>
            <span className="tree-name">{branch.name}</span>
            <span className="tree-detail">{branch.detail}</span>
          </li>
        ))}
      </ul>
      <p>Change the contract once, and the compiler points at everything that must follow.</p>
    </figure>
  )
}
