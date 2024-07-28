import { Prop as PrismaProp } from '.prisma/client'
import { PropValue } from '.prisma/client'

type Prop = PrismaProp & {
    propValue?: PropValue
    type: string
}

export type { Prop }
