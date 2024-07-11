use std::collections::HashMap;
use std::fmt::format;

use serde_json::Number;
use swc_common::Spanned;
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_ast::{
    BlockStmtOrExpr, Bool, Expr, ExprStmt, Ident, JSXAttr, JSXAttrName, JSXAttrOrSpread,
    JSXAttrValue, JSXElementChild, JSXElementName, JSXExpr, JSXExprContainer, JSXFragment,
    JSXMemberExpr, JSXObject, JSXOpeningElement, Lit, ModuleItem, Stmt,
};

pub fn get_props_of_element(element: JSXOpeningElement) -> HashMap<String, Vec<Number>> {
    let mut props = HashMap::new();

    element
        .attrs
        .into_iter()
        .for_each(|attr: JSXAttrOrSpread| match attr {
            JSXAttrOrSpread::JSXAttr(JSXAttr { name, value, .. }) => {
                let name = match name {
                    JSXAttrName::Ident(Ident { sym, .. }) => sym,
                    JSXAttrName::JSXNamespacedName(_) => todo!(),
                };

                let position = match value {
                    Some(JSXAttrValue::Lit(Lit::Str(str))) => {
                        vec![Number::from(str.span.lo.0), Number::from(str.span.hi.0)]
                    }
                    Some(JSXAttrValue::Lit(Lit::Bool(Bool { span, .. }))) => {
                        vec![Number::from(span.lo.0), Number::from(span.hi.0)]
                    }
                    Some(JSXAttrValue::JSXExprContainer(JSXExprContainer { expr, .. })) => {
                        match expr {
                            JSXExpr::Expr(expr) => match *expr {
                                Expr::Lit(lit) => match lit {
                                    Lit::Str(str) => vec![
                                        Number::from(str.span.lo.0),
                                        Number::from(str.span.hi.0),
                                    ],
                                    _ => vec![],
                                },
                                _ => vec![],
                            },
                            _ => vec![],
                        }
                    }
                    _ => vec![],
                };

                props.insert(name.to_string(), position);
            }
            _ => todo!(),
        });

    props
}

fn get_opening_element_name(element: JSXOpeningElement) -> String {
    match element.name {
        JSXElementName::Ident(Ident { sym, .. }) => sym.to_string(),
        JSXElementName::JSXMemberExpr(JSXMemberExpr { obj, prop, .. }) => match obj {
            JSXObject::Ident(Ident { sym, .. }) => format!("{}.{}", sym, prop.sym),
            _ => "JSXObject".to_string(),
        },
        _ => "JSXElementName".to_string(),
    }
}

pub fn get_element_name(element: JSXElementChild) -> String {
    match element {
        JSXElementChild::JSXElement(element) => get_opening_element_name(element.opening),
        JSXElementChild::JSXFragment(JSXFragment { span, .. }) => "JSXFragment".to_string(),
        JSXElementChild::JSXExprContainer(JSXExprContainer { expr, .. }) => match expr {
            JSXExpr::Expr(expr) => match *expr {
                Expr::Lit(lit) => match lit {
                    Lit::Str(_) => "LitStr".to_string(),
                    _ => "Lit".to_string(),
                },

                Expr::Arrow(arrow) => match *arrow.body {
                    BlockStmtOrExpr::BlockStmt(_) => "BlockStmt".to_string(),
                    BlockStmtOrExpr::Expr(expr) => match *expr {
                        Expr::Paren(paren) => match *paren.expr {
                            Expr::JSXFragment(_) => "JSXFragment".to_string(),
                            _ => "ParenExpr".to_string(),
                        },
                        _ => "Expr".to_string(),
                    },
                    _ => "ArrowExpr".to_string(),
                },
                _ => "Expr".to_string(),
            },
            _ => "JSXExpr".to_string(),
        },
        _ => "JSXElementChild".to_string(),
    }
}
