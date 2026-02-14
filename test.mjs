import { ASTNode, Interpreter } from "./index.mjs";

/**
const tree = new ASTNode("block", null, [
    new ASTNode("assign", null, [
        new ASTNode("variable", "a"),
        new ASTNode("numberLiteral", 123)
    ]),
    new ASTNode("assign", null, [
        new ASTNode("variable", "b"),
        new ASTNode("numberLiteral", 456)
    ]),
    new ASTNode("return", null, [new ASTNode("call", null, [
        new ASTNode("variable", "+"),
        new ASTNode("variable", "a"),
        new ASTNode("variable", "b"),
    ])])
])
 * numberLiteral
 * stringLiteral
 * boolLiteral
 * variable
 * assign
 * array
 * call
 * if
 * while
 * block
 * return
 */

/*
c= {
    a=123
    s=999
    b=s-a

    bbb = if b > 0 
            return s - a
        else 
            return a - s

    return bbb
}

 www  =  while c > 0
        {
            y = c% 10
            c=floor(c/10)

            return y
        }
        
        const tree = new ASTNode("block", null, [
    new ASTNode("assign", null, [
        new ASTNode("variable", "c"),
        new ASTNode("block", null, [
            new ASTNode("assign", null, [
                new ASTNode("variable", "a"),
                new ASTNode("numberLiteral", 123)
            ]),
            new ASTNode("assign", null, [
                new ASTNode("variable", "s"),
                new ASTNode("numberLiteral", 999)
            ]),
            new ASTNode("assign", null, [
                new ASTNode("variable", "b"),
                new ASTNode("call", null, [
                    new ASTNode("variable", "-"),
                    new ASTNode("variable", "s"),
                    new ASTNode("variable", "a"),
                ])
            ]),
            new ASTNode("assign", null, [
                new ASTNode("variable", "bbb"),
                new ASTNode("if", null, [
                    new ASTNode("call", null, [
                        new ASTNode("variable", ">"),
                        new ASTNode("variable", "b"),
                        new ASTNode("numberLiteral", 0),
                    ]),
                    new ASTNode("return", null, [
                        new ASTNode("call", null, [
                            new ASTNode("variable", "-"),
                            new ASTNode("variable", "s"),
                            new ASTNode("variable", "a"),
                        ]),
                    ]),
                    new ASTNode("return", null, [
                        new ASTNode("call", null, [
                            new ASTNode("variable", "-"),
                            new ASTNode("variable", "a"),
                            new ASTNode("variable", "s"),
                        ]),
                    ])
                ])
            ]),
            new ASTNode("return", null, [new ASTNode("variable", "bbb")])
        ])
    ]),
    new ASTNode("assign", null, [
        new ASTNode("variable", "www"),
        new ASTNode("while", null, [
            new ASTNode("call", null, [
                new ASTNode("variable", ">"),
                new ASTNode("variable", "c"),
                new ASTNode("numberLiteral", 0),
            ]),
           new ASTNode("block", null, [
               new ASTNode("assign", null, [
                   new ASTNode("variable", "y"),
                    new ASTNode("call", null, [
                        new ASTNode("variable", "%"),
                        new ASTNode("variable", "c"),
                        new ASTNode("numberLiteral", 10),
                    ]),
                ]),
                new ASTNode("assign", null, [
                    new ASTNode("variable", "c"),
                    new ASTNode("call", null, [
                        new ASTNode("variable", "floor"),
                        new ASTNode("call", null, [
                            new ASTNode("variable", "/"),
                            new ASTNode("variable", "c"),
                            new ASTNode("numberLiteral", 10),
                        ]),
                    ]),
                ]),
                new ASTNode("return", null, [new ASTNode("variable", "y")])
            ])
        ])
    ]),
    new ASTNode("return", null, [new ASTNode("variable", "www")])
])
*/

/*
a = [2, 4, 1, 7, 5]
i = 0
maximum = 0
while (i < 5) {
    maximum = max(maximum, a[i])
    i += 1
}
return maximum
*/
console.log("Hello")
const tree = new ASTNode("block", null, [
    new ASTNode("assign", null, [
        new ASTNode("variable", "a"),
        new ASTNode("array", null, [
            new ASTNode("numberLiteral", 2),
            new ASTNode("numberLiteral", 4),
            new ASTNode("numberLiteral", 1),
            new ASTNode("numberLiteral", 7),
            new ASTNode("numberLiteral", 5)
        ])
    ]),
    new ASTNode("assign", null, [
        new ASTNode("variable", "i"),
        new ASTNode("numberLiteral", 0)
    ]),
    new ASTNode("assign", null, [
        new ASTNode("variable", "maximum"),
        new ASTNode("numberLiteral", 0)
    ]),
    new ASTNode("while", null, [
        new ASTNode("call", null, [
            new ASTNode("variable", "<"),
            new ASTNode("variable", "i"),
            new ASTNode("numberLiteral", 5),
        ]),
        new ASTNode("block", null, [
            new ASTNode("assign", null, [
                new ASTNode("variable", "maximum"),
                new ASTNode("call", null, [
                    new ASTNode("variable", "max"),
                    new ASTNode("variable", "maximum"),
                    new ASTNode("call", null, [
                        new ASTNode("variable", "at"),
                        new ASTNode("variable", "a"),
                        new ASTNode("variable", "i"),
                    ])
                ])
            ]),
            new ASTNode("assign", null, [
                new ASTNode("variable", "i"),
                new ASTNode("call", null, [
                    new ASTNode("variable", "+"),
                    new ASTNode("variable", "i"),
                    new ASTNode("numberLiteral", 1),
                ]),
            ]),
        ])
    ]),
    new ASTNode("return", null, [new ASTNode("variable", "maximum")])
])



const interpreter = new Interpreter(tree);
const res = interpreter.run();
console.log(res)
console.log(interpreter.stack)