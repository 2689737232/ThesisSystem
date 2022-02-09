class Id {
   private count: number;

   constructor() {
      this.count = 1
   }

   genId(name: string) {
      return `id${name}${this.count++}${new Date().getTime() + Math.ceil(Math.random() * 10)}`
   }
}


export default Id;