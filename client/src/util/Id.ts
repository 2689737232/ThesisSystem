class Id {
   private count: number;

   constructor() {
      this.count = 1
   }

   genId(name: string) {
      return `id${name}${this.count}${new Date().getTime()}`
   }
}


export default Id;