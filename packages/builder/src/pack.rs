use std::borrow::Borrow;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

use serde::{Deserialize, Serialize};
use serde_json::Number;
use swc_common::comments::SingleThreadedComments;
use swc_common::{sync::Lrc, SourceMap};
use swc_common::{
    BytePos, FileName, Globals, LineCol, Mark, SourceFile, Span, Spanned, DUMMY_SP, GLOBALS,
};
use swc_ecma_ast::{
    ArrowExpr, BlockStmtOrExpr, Bool, Expr, ExprStmt, Ident, JSXAttr, JSXAttrName, JSXAttrOrSpread,
    JSXAttrValue, JSXClosingElement, JSXClosingFragment, JSXElement, JSXElementChild,
    JSXElementName, JSXExpr, JSXExprContainer, JSXFragment, JSXOpeningElement, JSXOpeningFragment,
    JSXText, Lit, Module, ModuleItem, ParenExpr, Program, Stmt, Str,
};

use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::{Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms::helpers::{inject_helpers, Helpers, HELPERS};
use swc_ecma_transforms::resolver;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::react;
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::FoldWith;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[derive(Debug, Deserialize, Clone)]
#[serde(untagged)]
pub enum Value {
    Str(String),
    Number(f64),
    Boolean(bool),
}

impl Into<swc_atoms::Atom> for Value {
    fn into(self) -> swc_atoms::Atom {
        match self {
            Value::Str(s) => s.into(),
            _ => panic!("Value variant not supported"),
        }
    }
}
struct Prop {
    name: String,
    value: Value,
}

#[derive(Debug, Deserialize)]
pub struct Component {
    #[serde(rename = "type")]
    pub type_: String,
    pub id: String,
    pub props: HashMap<String, Value>,
    pub children: Option<Vec<Component>>,
}
impl Clone for Component {
    fn clone(&self) -> Self {
        Component {
            type_: self.type_.clone(),
            id: self.id.clone(),
            props: self.props.clone(),
            children: self.children.clone(),
        }
    }
}
pub fn get_prop_attr(prop: Prop) -> JSXAttrOrSpread {
    JSXAttrOrSpread::JSXAttr(JSXAttr {
        span: DUMMY_SP,
        name: JSXAttrName::Ident(Ident::new(prop.name.clone().into(), DUMMY_SP)),
        value: Some(match prop.value {
            // if value started from #, then use { } and don't use quotes
            Value::Str(s) if s.starts_with('&') => {
                JSXAttrValue::JSXExprContainer(JSXExprContainer {
                    span: DUMMY_SP,
                    expr: JSXExpr::Expr(Box::new(Expr::Lit(Lit::JSXText(JSXText {
                        span: DUMMY_SP,
                        value: s.clone()[1..].into(),
                        raw: s[1..].into(),
                    })))),
                })
            }
            Value::Str(s) => JSXAttrValue::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: s.into(),
                raw: None,
            })),
            Value::Number(n) => JSXAttrValue::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: n.to_string().into(),
                raw: None,
            })),
            Value::Boolean(b) => JSXAttrValue::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: b,
            })),
        }),
    })
}

pub fn create_component(
    name: &str,
    props: HashMap<String, Value>,
    children: Vec<JSXElementChild>,
) -> JSXElement {
    let prop_vec: Vec<Prop> = props
        .into_iter()
        .map(|(name, value)| Prop { name, value })
        .collect();

    let prop_attrs: Vec<JSXAttrOrSpread> = prop_vec.into_iter().map(get_prop_attr).collect();

    let mut props_with_dummy_space = prop_attrs.clone();
    props_with_dummy_space.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
        span: DUMMY_SP,
        name: JSXAttrName::Ident(Ident::new("".into(), DUMMY_SP)),
        value: None,
    }));

    JSXElement {
        span: DUMMY_SP,
        opening: JSXOpeningElement {
            span: DUMMY_SP,
            name: JSXElementName::Ident(Ident::new(name.into(), DUMMY_SP)),
            attrs: props_with_dummy_space,
            self_closing: false,
            type_args: None,
        },
        children: children.clone(),
        closing: Some(JSXClosingElement {
            span: DUMMY_SP,
            name: JSXElementName::Ident(Ident::new(name.into(), DUMMY_SP)),
        }),
    }
}

pub fn create_component_with_children(component: Component, is_debug: bool) -> JSXElement {
    let created = create_component(
        &component.type_,
        component.props,
        match component.children {
            Some(children) => vec![JSXElementChild::JSXExprContainer(JSXExprContainer {
                expr: JSXExpr::Expr(Box::new(Expr::Arrow(ArrowExpr {
                    span: DUMMY_SP,
                    params: vec![Ident::new(component.id.clone().into(), DUMMY_SP).into()],
                    body: Box::new(
                        Expr::Paren(ParenExpr {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::JSXFragment(JSXFragment {
                                closing: JSXClosingFragment { span: DUMMY_SP },
                                opening: JSXOpeningFragment { span: DUMMY_SP },
                                span: DUMMY_SP,
                                children: children
                                    .into_iter()
                                    .map(|child| create_component_with_children(child, is_debug))
                                    .map(|child| JSXElementChild::JSXElement(Box::new(child)))
                                    .collect(),
                            })),
                        })
                        .into(),
                    ),
                    is_async: false,
                    is_generator: false,
                    type_params: None,
                    return_type: None,
                }))),
                span: DUMMY_SP,
            })],
            None => vec![],
        },
    );

    if is_debug {
        let mut propsHashMap = HashMap::new();
        propsHashMap.insert("id".to_string(), Value::Str(component.id.clone()));
        return create_component(
            "DebugComponent",
            propsHashMap,
            vec![JSXElementChild::JSXElement(Box::new(created))],
        );
    }

    created
}

pub fn parse_module(
    jsx: &String,
    cm: &Lrc<SourceMap>,
    comments: Option<SingleThreadedComments>,
) -> Module {
    let fm: Lrc<SourceFile> = cm.new_source_file(FileName::Custom("input".into()), jsx.into());

    let lexer = Lexer::new(
        Syntax::Typescript(TsConfig {
            tsx: true,
            disallow_ambiguous_jsx_like: true,
            ..Default::default()
        }),
        Default::default(),
        StringInput::from(&*fm),
        Some(&comments),
    );

    let mut parser = Parser::new_from(lexer);

    match parser.parse_module() {
        Ok(module) => module,
        Err(err) => {
            panic!("Error parsing jsx");
        }
    }
}

pub fn create_compiled_code(jsx: &String) -> String {
    let globals = Globals::new();
    GLOBALS.set(&globals, || {
        let cm: Lrc<SourceMap> = Lrc::new(SourceMap::default());

        let module = parse_module(&jsx, &cm, None);

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let module = HELPERS.set(&Helpers::new(false), || {
            Program::Module(module)
                .fold_with(&mut resolver(unresolved_mark, top_level_mark, false))
                .fold_with(&mut decorators(decorators::Config {
                    legacy: true,
                    emit_metadata: Default::default(),
                    use_define_for_class_fields: false,
                }))
                .fold_with(&mut strip(top_level_mark))
                .fold_with(&mut react::<SingleThreadedComments>(
                    cm.clone(),
                    None,
                    Default::default(),
                    top_level_mark,
                    unresolved_mark,
                ))
                .fold_with(&mut inject_helpers(unresolved_mark))
                .module()
                .unwrap()
        });

        let mut buf = vec![];
        let wr = JsWriter::new(cm.clone(), "\n", &mut buf, None);
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(true),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(wr),
        };

        emitter.emit_module(&module).unwrap();
        String::from_utf8_lossy(&buf).to_string()
    })
}

pub fn emit_component_tree(component_tree: JSXElement) -> String {
    let m = Module {
        span: DUMMY_SP,
        body: vec![ModuleItem::Stmt(Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::JSXElement(Box::new(component_tree))),
        }))],
        shebang: None,
    };

    let cm: Lrc<SourceMap> = Default::default();

    let mut buf = vec![];

    let mut emitter = Emitter {
        cfg: Default::default(),
        cm: cm.clone(),
        comments: None,
        wr: JsWriter::new(cm, "\n", &mut buf, None),
    };

    emitter.emit_module(&m).unwrap();
    String::from_utf8_lossy(&buf).to_string()
}
