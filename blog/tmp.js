class Animal {
  constructor() {
    this.type = '动物';
  }
}

class Cat extends Animal {
  constructor(name) {
    super();
    this.name = name;
  }
}

const cat = new Cat('花花');
console.log(cat.type);
