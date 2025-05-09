import React, { useEffect, useState } from 'react'

type Post = {
    userId: number
    id: number
    title: string
    body: string
}

type Props = {
    children: (post: Post) => React.ReactNode
    id: string
}

export const PostProvider = ({ id, children }: Props) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then((response) => response.json())
            .then((json) => setData(json))
    }, [id])

    if (!data) {
        return <div>Loading...</div>
    }

    return <>{children(data)}</>
}
