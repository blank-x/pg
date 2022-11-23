import moments from 'moment';

// 这样之后就能调用foo方法,并且不会包ts类型错误
declare module "moment" {
  export function foo(): number;
}

moments.foo()

// 对String扩展之后就可以直接调用字符串上的fancyFormat方法
declare global {
  interface String {
    fancyFormat(opts: string): string;
  }
}

var a = '1212';

a.fancyFormat('1212');

type ShoutyGreeting = Uppercase<'sdsdsd'>        //   "HELLO, WORLD"