use pack::create_compiled_code;
use std::collections::HashMap;
use subchildren::{ComponentMap, MappedSubchildren};
use swc_ecma_ast::{JSXElementChild, JSXElementName};
use wasm_bindgen::prelude::*;

use serde::{Deserialize, Serialize};
use serde_json::Number;

mod pack;
mod props;
mod subchildren;

#[derive(Debug, Serialize)]
struct Result {
    jsx: Option<String>,
    errors: Vec<String>,
    map: Option<Vec<MappedSubchildren>>,
    code: Option<String>,
}

#[wasm_bindgen]
pub fn transpile(json_schema: &str) -> String {
    wasm_logger::init(wasm_logger::Config::default());

    let components: Vec<pack::Component> = match serde_json::from_str(json_schema) {
        Ok(schema) => schema,
        Err(err) => {
            return serde_json::to_string(&Result {
                errors: vec![format!("Error deserializing JSON schema: {}", err)],
                jsx: None,
                map: None,
                code: None,
            })
            .unwrap();
        }
    };

    // Create a JSXElement from the Component struct
    let component_tree = pack::create_component(
        "",
        HashMap::new(),
        components
            .clone()
            .into_iter()
            .map(|child| pack::create_component_with_children(child, true))
            .map(|child| JSXElementChild::JSXElement(Box::new(child)))
            .collect(),
    );

    let jsx = pack::emit_component_tree(component_tree);

    let map = Some(subchildren::create_component_map(&jsx, &components));

    let code = Some(create_compiled_code(&jsx));

    serde_json::to_string(&Result {
        jsx: Some(jsx),
        errors: vec![],
        map,
        code,
    })
    .unwrap()
}
