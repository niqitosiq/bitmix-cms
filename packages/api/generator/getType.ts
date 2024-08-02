import { Type } from 'ts-morph'

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

export const getType = (type: Type, currentLevel = 0) => {
    if (currentLevel > 10) {
        return '...'
    }

    if (type.isUnionOrIntersection()) {
        console.log('UNION', type.getText())
        console.log(type.getUnionTypes())
        return type
            .getIntersectionTypes()
            .map((unionType) => {
                console.log('UNION PART', type.getText())

                const isCustom = (name) =>
                    name.includes('React.') || name.includes('JSX.')

                return isCustom(unionType.getText())
                    ? unionType.getText()
                    : getType(unionType, currentLevel + 1)
            })
            .join(' | ')
    }

    if (type.getCallSignatures().length > 0) {
        return type
            .getCallSignatures()
            .map((signature) => {
                const params = signature
                    .getParameters()
                    .map((param) => {
                        const declaration = param.getValueDeclaration()
                        if (!declaration) return `${param.getName()}: any`
                        const paramType = param.getTypeAtLocation(declaration)
                        return `${param.getName()}: ${getType(paramType, currentLevel + 1)}`
                    })
                    .join(', ')

                const returnType = signature.getReturnType()
                console.log('SIGNATURE', params, returnType.getText())
                if (returnType.getText().includes('React.')) {
                    return `(${params}) => ${returnType.getText()}`
                }
                return `(${params}) => ${getType(returnType, currentLevel + 1)}`
            })
            .join(', ')
    }

    if (type.isObject()) {
        return `{
      ${type
          .getProperties()
          .map((prop) => {
              const declaration = prop.getValueDeclaration()
              if (!declaration) return `${prop.getName()}: any`
              const propType = prop.getTypeAtLocation(declaration)
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
