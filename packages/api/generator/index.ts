import { PrismaClient } from '@prisma/client'

import { Project, Type } from 'ts-morph'
import fs from 'fs'
import path from 'path'
import { getType } from './getType'

const __dirname = import.meta.dirname
const prisma = new PrismaClient()

const basePath = path.resolve(__dirname, '../../library')

const project = new Project({
    tsConfigFilePath: `${basePath}/tsconfig.json`,
})

const start = async () => {
    console.log(basePath)

    project.addSourceFilesAtPaths(`${basePath}/src/**/*.ts`)
    project.addSourceFilesAtPaths(`${basePath}/src/**/*.tsx`)

    const files = fs.readdirSync(`${basePath}/src`)

    const sourceDefenitionFileText = `
      ${files
          .map((file) => `import ${file} from '${basePath}/src/${file}';`)
          .join('\n\t')}

      const Library = {
        ${files.map((file) => `${file}`).join(',\n\t')}
      }

      type LibraryType = typeof Library
    `

    console.log(sourceDefenitionFileText)

    const sourceFile = project.createSourceFile(
        `./generated.ts`,
        sourceDefenitionFileText,
        {
            overwrite: true,
        }
    )

    const typeAlias = sourceFile.getTypeAliasOrThrow('LibraryType')
    const type = typeAlias.getType()

    const types = type.getProperties().map((subType) => {
        const propType = subType.getTypeAtLocation(
            subType.getValueDeclarationOrThrow()
        )

        return {
            name: subType.getName(),
            type: getType(propType, 0),
        }
    })

    const promises: Promise<any>[] = []

    types.forEach(({ name, type }) => {
        console.log(`${name}: ${type}`)

        promises.push(
            prisma.frame
                .findUnique({
                    where: {
                        name,
                    },
                })
                .then(async (frame) => {
                    console.log(frame)

                    if (frame) {
                        await prisma.frame.update({
                            where: {
                                id: frame.id,
                            },
                            data: {
                                name,
                                type,
                                isBase: true,
                                code: `() => Library.${name}`,
                            },
                        })
                    } else {
                        await prisma.frame.create({
                            data: {
                                description: type,
                                name,
                                type,
                                isBase: true,
                                code: `() => Library.${name}`,
                            },
                        })
                    }
                })
        )
    })

    await Promise.all(promises)
}

start()
