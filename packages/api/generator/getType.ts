import { Type, TypeFormatFlags } from 'ts-morph'

const getOnlyCustomTypes = (type: Type) => {
    return type
        .getSymbol()
        ?.getDeclarations()
        .filter((declaration) => {
            return !declaration
                .getSourceFile()
                .getFilePath()
                .includes('node_modules')
        })
}

const isDefaultType = (type: Type) => {
    // console.log(type.getBaseTypes())

    return type.getBaseTypes().length !== 0
}
export const getType = (type: Type, currentLevel = 0) => {
    // console.log('level', currentLevel)

    if (currentLevel > 10) {
        return 'any'
    }

    const isCustom = (name) => name.includes('React.') || name.includes('JSX.')

    if (type.isUnion()) {
        return type
            .getUnionTypes()
            .map((unionType) => {
                return isCustom(unionType.getText())
                    ? unionType.getText()
                    : getType(unionType, currentLevel + 1)
            })
            .join(' | ')
    }
    if (type.isIntersection()) {
        // console.log('UNION', type.getText())
        // // console.log(type.getUnionTypes())
        return type
            .getIntersectionTypes()
            .map((unionType) => {
                // console.log('UNION PART', unionType.getText())

                return isCustom(unionType.getText())
                    ? unionType.getText()
                    : getType(unionType, currentLevel + 1)
            })
            .join(' | ')
    }

    if (type.getCallSignatures().length > 0) {
        // console.log('CALL SIGNATURE', type.getCallSignatures())
        return type
            .getCallSignatures()
            .map((signature) => {
                const params = signature
                    .getParameters()
                    .map((param) => {
                        const declaration = param.getValueDeclaration()
                        if (!declaration) return `${param.getName()}: any`

                        const paramType = param.getTypeAtLocation(declaration)
                        // console.log('PARAM', paramType.getText())
                        return `${param.getName()}: ${getType(paramType, currentLevel + 1)}`
                    })
                    .join(', ')

                const returnType = signature.getReturnType()
                if (returnType.getText().includes('React.')) {
                    return `(${params}) => ${returnType.getText()}`
                }
                return `((${params}) => ${getType(returnType, currentLevel + 1)})`
            })
            .join(', ')
    }

    if (type.isObject()) {
        // console.log('OBJECT', type.getText())
        if (type.getText().includes('node_modules')) {
            // if (currentLevel > 7) {

            // Partial<import("/anything/node_modules/embla-carousel/esm/components/Options")>
            // should be
            // Partial<import("embla-carousel/esm/components/Options")>
            return type.getText().replace(/\/.*node_modules\//, '')
            // }
        }

        return `{
      ${type
          .getProperties()
          .map((prop) => {
              const declaration = prop.getValueDeclaration()
              if (!declaration) return `${prop.getName()}: any`
              const propType = prop.getTypeAtLocation(declaration)
              // console.log('PROPERTY', propType.getText())
              return `${prop.getName()}: ${getType(propType, currentLevel + 1)}`
          })
          .join(', ')}
      }`
    }

    if (type.isArray()) {
        const arrayType = type.getArrayElementTypeOrThrow()
        return `${getType(arrayType, currentLevel + 1)}[]`
    }

    return type.getText()
}
