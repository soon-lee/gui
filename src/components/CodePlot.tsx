import {createEffect, createSignal} from "solid-js";
import {highlightElement} from "prismjs";
import {Parser} from 'acorn'
import jsx from 'acorn-jsx'
import {ast2str} from "../utils/ast.ts";

interface CodePlotProps {
    language: string;
    code: string;
}


export const CodePlot = (props: CodePlotProps) => {
    const [preRef] = createSignal<HTMLPreElement | undefined>();
    const [test, setTest] = createSignal(props.code);

    createEffect(() => {
        preRef() && highlightElement(preRef()!);
    });
    createEffect(() => {
        // fetch('/src/components/prettify.js.txt')
        fetch('/src/components/new.js.txt')
            .then(res => res.text())
            .then(text => {
                setTest(text)
                const ast = Parser.extend(jsx())
                                  .parse(
                                      text,
                                      {
                                          sourceType: 'module', ecmaVersion: 7,
                                          onComment: (
                                              isBlock,
                                              text,
                                              start,
                                              end,
                                              startLoc,
                                              endLoc
                                          ) => {
                                              console.log(
                                                  isBlock,
                                                  text,
                                                  start,
                                                  end,
                                                  startLoc,
                                                  endLoc
                                              )
                                          }
                                      }
                                  );
                console.log(ast);
                ast2str(ast)
            })
    })
    return (
        <pre class={`language-${props.language} line-numbers`} ref={preRef()}>
            <code>{test()}</code>
        </pre>
    );
}