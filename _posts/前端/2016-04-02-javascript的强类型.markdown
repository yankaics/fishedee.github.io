---
layout: post
category: 前端
---

# 1 概述
如果你的前端工程只是两三千行，那么使用简单的javascript也没有什么大问题，但当你的工程进展到两三万行时，原来全动态化的javascript则会带来很头疼的问题。因为哪天想重构一个函数的函数名时，你都不确信有多少个调用方调用了这个函数。改少了一个调用方的名字，将会造成严重的undefined结果。

所以，对于小项目来说，弱类型更适合，十分灵活，可以写出非常简洁的代码。但是，对于大型项目来说，强类型更有利，可以降低系统的复杂度，在编译时就发现类型错误，减轻程序员的负担。javascript的强类型化目前有两个方案，我们来对比一下。

# 2 设计
flow初始化是设计为一个javascript语言的静态类型检查工具，而typescript则是要设计一个javascript的超集，一个满足适合scalable的Javascript的语言。所以，flow更适合在原有codebase上不断渐进为强类型的codebase，而typescript则适合从一开始就彻底是强类型的codebase。

# 3 检查

## 3.1 null与undefined的检查

```
function optional_fun(foo : string) {
  console.log(foo);
}
optional_fun("foo");
optional_fun(undefined);
optional_fun(null);
```

这段代码在flow中是会报错的，因为flow认为string是实类型，不可以包含undefined与null，而String才是允许有null或undefined的string类型。但是在typescript中是不会报错的，因为其认为string就是指flow中的String。

## 3.2 漏检

### 3.2.1 动态函数与属性

```
var result = {};
result["func"+2] = function (m :string):string{
	return m +"dd1";
}
result["func"+1] = function (m :number):number{
	return m + 3;
}

result.func1("1");
result.func2(2);
```

在以上代码在flow中会造成类型检查的漏检，而typescript中则直接报错，因为flow认为result中的部分属性是动态，所以放松了检查，但是typescript则认为类型应该为静态，不允许动态加载的，所以报错的。

### 3.2.2 强制类型转换

```
let str : any = "xxs" ;
let num : number = (<number>str); 
console.log(num);
```

无法是flow与typescript，当遇到强制类型转换时，并不会插入runtime代码来检查程序员所做的检查是否为正确的，而是选择了信任程序员，这导致了上面的num变量为number类型，但运行时成为string类型，而且并没有抛异常。

### 3.2.3 数组越界与映射越界

```
let array1 : number[] = [1,2,3,4];
let array2 : {[name:string]:string} = {};

console.log(array1[123]);
console.log(array2["123"]);
```

无论是flow与typescript，当数组或映射越界时，也不会抛异常，而是仅仅返回了undefined。

### 3.2.4 动态检查

```
//原代码
function sum(a: number, b: number) {
  return a + b;
}
//flowcheck代码
function sum(a, b) {
  f.check(arguments, _f.args([_f.number, _f.number]));
  return a + b;
}
```

为了增强类型检查的特性，flow的动态版本[flowcheck](http://gcanti.github.io/flowcheck/)支持在运行时检查类型检查，实现类型在运行时的强类型检查。而typescript则暂时没有这样的计划。话虽如此，flowcheck依然没有数组越界与映射越界的错误捕捉。另外，由于flowcheck的开销较大，一般也只会做开发模式中运行。

# 4 生态

![Screen Shot 2016-04-02 at 3.15.42 P](/assets/img/Screen%20Shot%202016-04-02%20at%203.15.42%20PM.png)

![Screen Shot 2016-04-02 at 3.15.51 P](/assets/img/Screen%20Shot%202016-04-02%20at%203.15.51%20PM.png)

TypeScript是于2011年由MS启动的一个项目，而Flow是2014年由Facebook启动的一个项目。由于TypeScript启动要早很多，也很成熟，所以像jquery，underscore，都有了TypeScript的类型声明，也就是说你可以引入这些[第三方库](http://definitelytyped.org/)，并享受到强类型化带来的好处，而Flow对这些是没戏了。另外，目前由TypeScript开发的项目有Angular2，Ionic，immutable，而Flow开发的项目为React与React-Native。

# 5 总结

![Screen Shot 2016-04-02 at 3.31.23 P](/assets/img/Screen%20Shot%202016-04-02%20at%203.31.23%20PM.png)

受限于javascript本身的动态特性，javascript的类型化仅仅停留在静态检查的地步，运行时并不会抛异常，这远远没有达到像swift与go这样的强类型地步。而在控制代码的风格，以及静态类型检查的深度上，TypeScript做得比Flow要更彻底，但是TypeScript比Flow较弱的地方是，所有类型都允许undefined与null的值设置为合法值。另外，TypeScript的生态要比Flow要好很多，更多的第三方支持，更多的IDE自动提示支持，在一般情况下，更推荐使用TypeScript。


