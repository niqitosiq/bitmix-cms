export type SchemaToTranspileComponent = {
    type: string
    id: string
    props: {
        [key: string]: string | undefined | null
    }
    children: SchemaToTranspileComponent[]
}

export type Map = {
    id: string
    map: {
        name: string
        component: {
            children_params: [number, number] | []
            own: Array<number>
            props: Record<string, Array<number>>
            supplemened: number
        }
    }
}[]

export type Transpiled = {
    jsx: string
    erorrs?: string[]
    map: Map
    code: string
}
