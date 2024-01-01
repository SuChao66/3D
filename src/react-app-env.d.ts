declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >
  const content: ReactComponent
  export default content
}

declare module '*.svg?url' {
  const src: string
  export default src
}

declare module '*.glsl' {
  const value: string
  export default value
}
