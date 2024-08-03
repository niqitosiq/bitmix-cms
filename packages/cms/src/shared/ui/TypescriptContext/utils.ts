import { getCompilerOptionsFromParams } from '../../../../../../submodules/typescript-website/packages/sandbox/src/compilerOptions'
import lzstring from 'lz-string'
import { setupTypeAcquisition } from '../../../../../../submodules/typescript-website/packages/ata/src/index'
import {
    CompilerOptions,
    JsxEmit,
    ModuleKind,
    ModuleResolutionKind,
    ScriptTarget,
} from 'typescript'
import {
    createVirtualTypeScriptEnvironment,
    createSystem,
    createDefaultMapFromCDN,
} from '@typescript/vfs'

export function getDefaultSandboxCompilerOptions(
    config: SandboxConfig,
    ts: { versionMajorMinor: string }
) {
    const [major] = ts.versionMajorMinor.split('.').map((v) => parseInt(v)) as [
        number,
        number,
    ]
    const useJavaScript = config.filetype === 'js'
    const settings: CompilerOptions = {
        strict: true,

        noImplicitAny: false,
        strictNullChecks: !useJavaScript,
        strictFunctionTypes: true,
        strictPropertyInitialization: true,
        strictBindCallApply: true,
        noImplicitThis: true,
        noImplicitReturns: true,
        noUncheckedIndexedAccess: false,

        // 3.7 off, 3.8 on I think
        useDefineForClassFields: true,

        alwaysStrict: true,
        allowUnreachableCode: true,
        allowUnusedLabels: true,

        downlevelIteration: false,
        noEmitHelpers: false,
        noLib: false,
        noStrictGenericChecks: false,
        noUnusedLocals: false,
        noUnusedParameters: false,

        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        preserveConstEnums: false,
        removeComments: false,
        skipLibCheck: false,

        checkJs: useJavaScript,
        allowJs: useJavaScript,
        declaration: true,

        importHelpers: true,

        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        moduleResolution: ModuleResolutionKind.NodeJs,

        target: ScriptTarget.ES2017,
        jsx: JsxEmit.React,
        module: ModuleKind.ESNext,
    }

    if (major >= 5) {
        settings.experimentalDecorators = false
        settings.emitDecoratorMetadata = false
    }

    return { ...settings, ...config.compilerOptions }
}
/**
 * These are settings for the playground which are the equivalent to props in React
 * any changes to it should require a new setup of the playground
 */
export type SandboxConfig = {
    /** The default source code for the playground */
    text: string
    /** @deprecated */
    useJavaScript?: boolean
    /** The default file for the playground  */
    filetype: 'js' | 'ts' | 'd.ts'
    /** Compiler options which are automatically just forwarded on */
    compilerOptions: CompilerOptions
    /** Acquire types via type acquisition */
    acquireTypes: boolean
    /** Support twoslash compiler options */
    supportTwoslashCompilerOptions: boolean
    /** Get the text via query params and local storage, useful when the editor is the main experience */
    suppressAutomaticallyGettingDefaultText?: true
    /** Suppress setting compiler options from the compiler flags from query params */
    suppressAutomaticallyGettingCompilerFlags?: true
    /** Optional path to TypeScript worker wrapper class script, see https://github.com/microsoft/monaco-typescript/pull/65  */
    customTypeScriptWorkerPath?: string
    /** Logging system */
    logger: {
        log: (...args: unknown[]) => void
        error: (...args: unknown[]) => void
        groupCollapsed: (...args: unknown[]) => void
        groupEnd: (...args: unknown[]) => void
    }
} & (
    | { /** the ID of a dom node to add monaco to */ domID: string }
    | { /** the dom node to add monaco to */ elementToAppend: HTMLElement }
)
/** The default settings which we apply a partial over */
export function defaultPlaygroundSettings() {
    const config: SandboxConfig = {
        text: '',
        domID: '',
        compilerOptions: {
            jsx: JsxEmit.React,
            strict: true,
            esModuleInterop: true,
            module: ModuleKind.ESNext,
            suppressOutputPathCheck: true,
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            moduleResolution: ModuleResolutionKind.NodeJs,
        },
        acquireTypes: true,
        filetype: 'ts',
        supportTwoslashCompilerOptions: false,
        logger: console,
    }
    return config
}

/** Creates a sandbox editor, and returns a set of useful functions and the editor */
export const createTypeScriptSandbox = async (
    partialConfig: Partial<SandboxConfig>,
    ts: typeof import('typescript')
) => {
    const config = { ...defaultPlaygroundSettings(), ...partialConfig }

    const compilerDefaults = getDefaultSandboxCompilerOptions(config, ts)

    let compilerOptions: CompilerOptions
    if (!config.suppressAutomaticallyGettingCompilerFlags) {
        const params = new URLSearchParams(location.search)
        const queryParamCompilerOptions = getCompilerOptionsFromParams(
            compilerDefaults,
            ts,
            params
        )
        if (Object.keys(queryParamCompilerOptions).length)
            config.logger.log(
                '[Compiler] Found compiler options in query params: ',
                queryParamCompilerOptions
            )
        compilerOptions = { ...compilerDefaults, ...queryParamCompilerOptions }
    } else {
        compilerOptions = compilerDefaults
    }
    const fsMap = await createDefaultMapFromCDN(
        compilerOptions,
        ts.version,
        true,
        ts,
        lzstring
    )

    let created = false
    const pullDependencies = setupTypeAcquisition({
        projectName: 'TypeScript Playground',
        typescript: ts,
        logger: console,
        delegate: {
            receivedFile: (code, path) => {
                const isSupported =
                    path.includes('.d.ts') ||
                    path.includes('.ts') ||
                    path.includes('.tsx') ||
                    path.includes('.cts') ||
                    path.includes('.mts')

                if (isSupported)
                    if (created) {
                        env.createFile(path, code)
                    } else fsMap.set(path, code)
            },
            progress: () => {},
            started: () => {},
            finished: () => {},
        },
    })

    fsMap.set('dependencies.ts', `// deps`)
    await pullDependencies('import React from "@types/react";')
    created = true

    fsMap.set('input.tsx', `// main TypeScript file content`)

    const system = createSystem(fsMap)

    const env = createVirtualTypeScriptEnvironment(
        system,
        Array.from(fsMap.keys()),
        ts,
        compilerOptions
    )

    return { env, pullDependencies }
}
