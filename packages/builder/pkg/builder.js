import * as wasm from "./builder_bg.wasm";
import { __wbg_set_wasm } from "./builder_bg.js";
__wbg_set_wasm(wasm);
export * from "./builder_bg.js";
