import type { Site } from '../types'

type Props = {
    id: Site['id']
    name: Site['name']
}

export const SiteInline = ({ name, id }: Props) => {
    return (
        <>
            <h2>{name}</h2>
            <p>{id}</p>
        </>
    )
}
