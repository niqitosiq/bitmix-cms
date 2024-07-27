import { Type } from 'ts-morph'

export const getType = (type: Type, currentLevel = 0) => {
    const isCustomType = type
        .getSymbol()
        ?.getDeclarations()
        .some((declaration) =>
            declaration.getSourceFile().getFilePath().includes('library')
        )

    if (!isCustomType) return type.getText()

    if (currentLevel > 10) {
        return '...'
    }
    if (type.getCallSignatures().length > 0) {
        return type
            .getCallSignatures()
            .map((signature) => {
                const params = signature
                    .getParameters()
                    .map((param) => {
                        const paramType = param.getTypeAtLocation(
                            param.getValueDeclarationOrThrow()
                        )
                        return `${param.getName()}: ${getType(paramType, currentLevel + 1)}`
                    })
                    .join(', ')
                const returnType = signature.getReturnType()
                return `(${params}) => ${getType(returnType, currentLevel + 1)}`
            })
            .join(', ')
    }

    if (type.isObject()) {
        return `{
      ${type
          .getProperties()
          .map((prop) => {
              const propType = prop.getTypeAtLocation(
                  prop.getValueDeclarationOrThrow()
              )
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
