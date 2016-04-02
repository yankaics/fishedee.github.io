---
layout: post
category: 前端
---

# 1 概述
javascript的语法比较讨好人，但比较头疼的一点，全动态特性，导致运行时可能会报出一些undefined的错误，而且还很难找出位置。基于我们之前从弱类型的php转向强类型的go后，代码稳定性有了很好的提高，我们也在纠结要不要将javascript切换成typescript。毕竟，能用机器排错的问题，就应该交给机器来做。

```
let result :string
result = "Hello World"
console.log(result);
```

按照惯例，HelloWorld入门

```
tsc hello.ts
node hello.js
```

执行tsc将typescript代码切换为javascript，然后用node将生成javascript跑起来

# 2 基础类型

## 2.1 数值类型

```
let isDone : boolean = false;
let decimal : number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
console.log(isDone);
console.log(decimal);
console.log(hex);
console.log(binary);
console.log(octal);
```

## 2.2 字符串类型

```
let str1: string = "str1";
let str2: string = "str2";

console.log(str1);
console.log(str1+str2);
console.log(`mm_${str1}_dd_${str2}`);
```

## 2.3 数组

```
let list:number[] = [1,2,3]

console.log(list);
list.push(4);
console.log(list);
for( let i : number = 0 ; i != list.length ; ++i ){
	console.log(list[i]);
}

console.log(list[124]);
```

要注意的是，typescript对越界的数组并没有抛异常，这是一个隐忧

## 2.4 枚举

```
enum Color {Red, Green, Blue};
let c: Color = Color.Green;

console.log(c);
```

## 2.5 通用类型

```
let notSure: any = 4;
notSure = "maybe a string instead";

console.log(notSure);

notSure = false;

console.log(notSure);
```

当然有了通用类型，就会有强制类型转换

```
let someValue: any = "this is a string";

let strLength: number = <number>someValue;

console.log(strLength);
```

不过没有runtime支持，这也是一个隐忧

## 2.6 空值

```
function warnUser(): void {
    alert("This is my warning message");
}
```

## 2.7 null与undefined

```
function optional_fun(foo : string) {
  console.log(foo);
}
optional_fun("foo");
optional_fun(undefined);
optional_fun(null);
```

null与undefined可以作为参数来传输，这里是个隐忧

## 2.7 自动类型推导

```
let m = 3;

console.log(m);

m = "123";

console.log(m);
```

在声明时初始化变量，typescript会自动推导变量的类型，这个跟go的 := 是一样的

```
let m ;

m = 3;

console.log(m);

m = "123";

console.log(m);
```

但是只声明不定义的话，它就是any类型，这里是个隐忧。

# 3 函数

## 3.1 基础函数

```
function add(x: number, y: number): number {
    return x + y;
}

console.log(add(1,2));
```

## 3.2 默认参数

```
function buildName(firstName: string, lastName = "Smith") {
     return firstName + " " + lastName;
}

let employeeName = buildName("fish");

console.log(employeeName);

let employeeName2 = buildName("fish","MJ");

console.log(employeeName2);
```

这个挺好的

## 3.3 不定参数

```
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");

console.log(employeeName);
```

这个跟go倒是很像

## 3.4 lambda

```
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // Notice: the line below is now a lambda, allowing us to capture `this` earlier
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}
```

lambda函数，this不会丢失了，跟es6的一样

# 4 类

## 4.1 封装

```
class Greeter {
    private greeting: string;
    public constructor(message: string) {
        this.greeting = message;
    }
    public greet() :string{
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
//console.log(greeter.greeting);
console.log(greeter.greet());
```

还是挺简单的

## 4.2 继承

```
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters : number = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters : number = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam: Animal = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

extends继承，默认所有函数就是多态的

## 4.3 静态属性

```
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

类中加入静态属性

## 4.4 getter与setter

```
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

对属性进行操作，实际上调用的是函数，语法糖

# 5 接口

## 5.1 属性接口

```
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

基于属性的接口

## 5.2 方法接口

```
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    if (result == -1) {
        return false;
    }
    else {
        return true;
    }
}
console.log( mySearch("345","12"));
```

基于方法的接口

## 5.3 接口继承

```
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

没什么好说的

# 6 jsx

```
interface Props {
  foo: string;
}

class MyComponent extends React.Component<Props, {}> {
  render() {
    return <span>{this.props.foo}</span>
  }
}

<MyComponent foo="bar" />; // ok
<MyComponent foo={0} />; // error
```

typescript使用了模板类型来做React中的this.props和this.state的类型检查

# 7 总结
typescript是的目标是在javascript上建立类型推断，但是由于没有runtime的支持，typescript的type check只在编译时进行检查，运行时不检查，导致typescript对类型的支持存在比较多的隐忧。例如强制类型转换就运行时不检查，数组越界也不检查。


