use std::collections::HashMap;

use serde::Serialize;
use serde_json::Number;
use swc_common::Spanned;
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_ast::{
    BlockStmtOrExpr, Expr, ExprStmt, Ident, JSXElement, JSXElementChild, JSXElementName, JSXExpr,
    JSXExprContainer, JSXFragment, JSXMemberExpr, JSXObject, JSXOpeningElement, Lit, ModuleItem,
    Stmt,
};

use crate::pack::{self, Component};
use crate::props::{get_element_name, get_props_of_element};

fn get_module_item_body(module_item: ModuleItem) -> Vec<JSXElementChild> {
    match module_item {
        ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) => match *expr {
            Expr::JSXFragment(JSXFragment { children, .. }) => {
                return children;
            }
            _ => vec![],
        },
        _ => vec![],
    }
}

fn process_child_with_component<F>(
    children: &Vec<JSXElementChild>,
    components: Option<&Vec<Component>>,
    mut handler: F,
) where
    F: FnMut(&JSXElementChild, &Component),
{
    children
        .clone()
        .into_iter()
        .enumerate()
        .for_each(|(index, child)| {
            if let Some(components) = components {
                let current = components.get(index.clone()).unwrap();
                return handler(&child, current);
            }
        })
}

#[derive(Debug, Serialize)]
pub struct ComponentMap {
    props: HashMap<String, Vec<Number>>,
    own: Vec<Number>,
    supplemened: Number,
}

#[derive(Debug, Serialize)]
struct ChildrenMap {
    name: String,
    component: ComponentMap,
}
fn get_element_map(element: &JSXElement) -> ChildrenMap {
    let position = vec![
        Number::from(element.span.lo.0),
        Number::from(element.span.hi.0),
    ];
    let name = match element.opening.clone().name {
        JSXElementName::Ident(Ident { sym, .. }) => sym,
        JSXElementName::JSXMemberExpr(JSXMemberExpr { obj, prop }) => format!(
            "{}.{}",
            match obj {
                JSXObject::Ident(Ident { sym, .. }) => sym.to_string(),
                JSXObject::JSXMemberExpr(_) => "JSMemberExpr".to_string(),
            },
            prop.sym
        )
        .into(),
        _ => "JSXElementName".into(),
    };

    print!("element.opening!! {:?}\n", element.opening.clone().span);
    print!(
        "element.opening!! {:?}\n",
        element.opening.clone().span.hi.0
    );
    let supplemened = Number::from(element.opening.clone().span.hi.0);

    let props_positions = get_props_of_element(element.opening.clone());

    ChildrenMap {
        name: name.to_string(),
        component: ComponentMap {
            props: props_positions,
            own: position,
            supplemened,
        },
    }
}

fn process_child_container<F>(container_element: JSXExprContainer, mut handler: F)
where
    F: FnMut(&Vec<swc_ecma_ast::JSXElementChild>),
{
    match container_element.expr {
        JSXExpr::Expr(expr) => match expr.as_ref() {
            Expr::Arrow(arrow) => match arrow.body.as_ref() {
                BlockStmtOrExpr::BlockStmt(_) => {
                    todo!()
                }
                BlockStmtOrExpr::Expr(expr) => match expr.as_ref() {
                    Expr::Paren(paren) => match paren.expr.as_ref() {
                        Expr::JSXFragment(JSXFragment { children, .. }) => {
                            handler(&children.clone())
                        }
                        _ => {
                            todo!()
                        }
                    },
                    _ => {
                        todo!()
                    }
                },
                _ => {
                    todo!()
                }
            },
            Expr::Lit(lit) => match lit {
                Lit::Str(_) => {
                    todo!()
                }
                _ => {
                    todo!()
                }
            },
            Expr::Paren(_) => {
                todo!()
            }
            _ => {
                todo!()
            }
        },
        _ => {
            todo!()
        }
    }
}

#[derive(Debug, Serialize)]
pub struct MappedSubchildren {
    id: String,
    map: ChildrenMap,
}

fn parse_element_subchildren(
    map: &mut Vec<MappedSubchildren>,
    element: JSXElementChild,
    _component: Component,
) {
    match element {
        JSXElementChild::JSXElement(element) => {
            let element_map = get_element_map(&element);

            match element.opening.name {
                JSXElementName::Ident(Ident { sym, .. }) => {
                    print!("element name!! {:?}\n", sym);
                    if sym == "DebugComponent" {
                        element.children.iter().for_each(|child| {
                            parse_element_subchildren(map, child.clone(), _component.clone());
                        });
                        return;
                    }
                }
                _ => {}
            }
            map.push(MappedSubchildren {
                id: _component.id.clone(),
                map: element_map,
            });

            element.children.iter().for_each(|child| {
                parse_element_subchildren(map, child.clone(), _component.clone());
            });
        }
        JSXElementChild::JSXExprContainer(container) => {
            process_child_container(container, |children| {
                process_child_with_component(
                    children,
                    _component.children.as_ref(),
                    |child: &JSXElementChild, _component| {
                        parse_element_subchildren(map, child.clone(), _component.clone());
                    },
                );
            })
        }
        _ => {}
    }
}

pub fn create_component_map(
    jsx: &String,
    components: &Vec<pack::Component>,
) -> Vec<MappedSubchildren> {
    let cm: Lrc<SourceMap> = Lrc::new(SourceMap::default());

    let module = pack::parse_module(jsx, &cm, None);

    let mut map: Vec<MappedSubchildren> = vec![];

    module.body.into_iter().for_each(|module_item| {
        process_child_with_component(
            &get_module_item_body(module_item.clone()),
            Some(&components),
            |element, _component| {
                parse_element_subchildren(&mut map, element.clone(), _component.clone())
            },
        )
    });
    map
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let schema = r#"
      [
    {
        "type": "library.QueryParser",
        "id": "uuid1",
        "props": {
            "queryKey": "pizzaId"
        },
        "children": [
            {
                "type": "library.SinglePizzaResolver",
                "id": "uuid2",
                "props": {
                    "id": "queryKey"
                },
                "children": [
                    {
                        "type": "library.PizzaFull",
                        "id": "uuid3",
                        "props": {
                            "pizza": "&uuid2",
                            "className": "pizza"
                        }
                    },
                    {
                        "type": "library.Button",
                        "id": "uuid4",
                        "props": {
                            "type": "submit",
                            "className": "button",
                            "onClick": "&() => console.log(uuid1)"
                        },
                        "children": [
                            {
                                "type": "library.Paragraph",
                                "id": "uuid5",
                                "props": {}
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
    "#;

        let components = match serde_json::from_str(schema) {
            Ok(schema) => schema,
            Err(err) => {
                panic!("Error deserializing JSON schema: {}", err)
            }
        };

        let jsx = r#"<><DebugComponent id="uuid1"><library.QueryParser queryKey="pizzaId">{(uuid1)=>(<><DebugComponent id="uuid2"><library.SinglePizzaResolver id="queryKey">{(uuid2)=>(<><DebugComponent id="uuid3"><library.PizzaFull className="pizza" pizza={uuid2}></library.PizzaFull></DebugComponent><DebugComponent id="uuid4"><library.Button type="submit" className="button" onClick={() => console.log(uuid1)}>{(uuid4)=>(<><DebugComponent id="uuid5"><library.Paragraph></library.Paragraph></DebugComponent></>)}</library.Button></DebugComponent></>)}</library.SinglePizzaResolver></DebugComponent></>)}</library.QueryParser></DebugComponent></>"#;

        let map = create_component_map(&jsx.into(), &components);

        println!("{:?}", map);
    }
}
