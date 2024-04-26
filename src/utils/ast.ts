import {ClassDeclaration, ExpressionStatement, FunctionDeclaration, ModuleDeclaration, Identifier, Statement} from "acorn";

const dealExpression = (statement: ExpressionStatement) => {
    console.log(statement.expression);
    return "expression"
}

const dealClass = (statement: ClassDeclaration) => {
    ast2str(statement)
    return "class";
}

const dealFunction = (statement: FunctionDeclaration) => {
    ast2str(statement)
    console.log(statement.expression)
    return "function"
}

export const ast2str = (statement:  |Statement | ModuleDeclaration) => {
    switch (statement.type) {
        case "Identifier"
        case "EmptyStatement": {
            return "empty"
        }
        case "ExpressionStatement": {
            return dealExpression(statement);
        }
        case "BlockStatement":
            break;
        case "DebuggerStatement":
            break;
        case "WithStatement":
            break;
        case "ReturnStatement":
            break;
        case "LabeledStatement":
            break;
        case "BreakStatement":
            break;
        case "ContinueStatement":
            break;
        case "IfStatement":
            break;
        case "SwitchStatement":
            break;
        case "ThrowStatement":
            break;
        case "TryStatement":
            break;
        case "WhileStatement":
            break;
        case "DoWhileStatement":
            break;
        case "ForStatement":
            break;
        case "ForInStatement":
            break;
        case "ForOfStatement":
            break;
        case "FunctionDeclaration": {
            return dealFunction(statement)
        }
        case "VariableDeclaration":
            break;
        case "ClassDeclaration": {
            return dealClass(statement)
        }
        case "ImportDeclaration":
            break;
        case "ExportNamedDeclaration":
            break;
        case "ExportDefaultDeclaration":
            break;
        case "ExportAllDeclaration":
            break;
    }
}