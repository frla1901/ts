
    function calculateSum(num1 : number, num2 : number) {
    return num1 + num2;
}
let sum : number;
calculateSum(2, 3);

let strArr : string[] = ["bengal", "siames", "devon rex"];

enum themeColors { base = "#000", sucess = "#ccc", warning = "#F00", danger = "#0F0" };

console.log(themeColors.sucess); 

class Cat {
    private name : string;
    private breed : string;

    constructor( name : string, breed : string) {
        this.name = name;
        this.breed = breed;
    }

    public getCat() : string {
        return this.name + " (" + this.breed + ")";
    }

}

let cat1 = new Cat("mira", "Bengal");

console.log(cat1.getCat());

function member (name : string, course : string, semester : string, year : number) {
    console.log(`Medlemsnamn: ${name},
    Kursnamn: ${course}, 
    Period: ${year} ${semester}.`);
}
member("Frida", "Webbutveckling III", "HT", 2021)

