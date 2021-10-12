/* Min Gulp kod - TS DT173G Webbutveckling III*/


const {src, dest, parallel, series, watch} = require('gulp');   // Skapa variabel för att hämta i gulp-paketet med metoderna (src, dest, parallel, series och watch)
                                                                // src = hämtar in källkodsfiler 
                                                                // dest = lägger till källkodsfilerna i pub katalogen (pub) så de publiceras
                                                                // parallel = tasks/funktioner körs parallellt 
                                                                // series = tasks/funktioner körs i serie.
                                                                // watch = övervakar förändringar i tasks
                                                                
const concat = require('gulp-concat');                          // Skapa variabel för att hämta gulp-paketet concat som slår samman (konkatenerar CSS och JavaScript)  
const imagemin = require('gulp-imagemin');                      // Skapa variabel för att hämta gulp-paketet imagemin som komprimerar bilder
const cssnano = require('gulp-cssnano');                        // Skapa variabel för att hämta gulp-paketet cssnano som minifierar CSS
const terser = require('gulp-terser');                          // Skapa variabel för att hämta gulp-paketet terser som minifierar JavaScript
const browserSync =require('browser-sync').create();            // Skapa variabel för att starta "live-server" 
const sourceMaps = require('gulp-sourcemaps');                  // Skapar variabel för att kunna se sökväg till källkodsfilen (src inte pub)
const sass = require('gulp-sass')(require('sass'));             // Skapa variabel för att hämta sass och gulp-sass för att generera/kompilera CSS samt automatisera konverteringen mellan SASS och CSS. 
const babel = require('gulp-babel');                            // Skapa variabel för att transpilera/skapa bakåt-kompabilitet (js)
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.json");

const files = {
      // Skapa objekt som lagrar sökvägar
      htmlPath:"src/**/*.html",                 // sökväg till html filerna (src)
      //cssPath:"src/**/*.css",                 // sökväg till css filerna (src)
      scssPath:"src/**/*.scss",                 // sökväg till SASS filerna (src)
      jsPath:"src/**/*.js",                     // sökväg till js filerna (src)
      tsPath:"src/typescript/*.ts",             // sökväg till ts filerna (src)
      imagePath:"src/images/*"                  // sökväg till alla olika format i mappen images (src)
}

// Task 1 - HTML - funktion som kopierar/hämtar över alla html-filer till publicering (pub)
function taskHTML(){
    return src(files.htmlPath)  // gulp metoden src = vilka sökvägar och därmed filer ska hämtas?
    .pipe(dest('pub'));         // skicka vidare filerna till pub genom att använda metoden .pipe
}

// Ny Task 2 - SASS - funktion som kopierar/hämtar över alla scss-filer till publicering (pub)
function taskSCSS(){
    return src(files.scssPath)                  // gulp metoden src = vilka sökvägar och därmed filer ska hämtas?
    .pipe(sourceMaps.init())                    // startar upp möjlighet att se källkodens ursprunglig plats (sökväg)
    .pipe(sass().on("error", sass.logError))
    .pipe(concat('main.css'))                   // slår ihop alla css-filerna till en main.css fil 
    .pipe(cssnano())                            // minifierar alla css-filer
    .pipe(sourceMaps.write('../maps'))          // skriver källkodens ursprunglig plats (sökväg)
    .pipe(dest('pub/css'))                      // skicka vidare filerna till pub genom att använda metoden .pipe
    .pipe(browserSync.stream());                // hämtar scss/css förändringar 
}

// Tidigare Task 2 - CSS - funktion som kopierar/hämtar över alla css-filer till publicering (pub)
/*function taskCSS(){
    return src(files.cssPath)               // gulp metoden src = vilka sökvägar och därmed filer ska hämtas?
    .pipe(sourceMaps.init())                // startar upp möjlighet att se källkodens ursprunglig plats (sökväg)
    .pipe(concat('main.css'))               // slår ihop alla css-filerna till en main.css fil 
    .pipe(cssnano())                        // minifierar alla css-filer
    .pipe(sourceMaps.write('../maps'))      // skriver källkodens ursprunglig plats (sökväg)
    .pipe(dest('pub/css'))                  // skicka vidare filerna till pub genom att använda metoden .pipe
    .pipe(browserSync.stream());            // hämtar css förändringar 
}*/

// Task 3 - JS - funktion som kopierar/hämtar över alla js.filer till publicering (pub)
function taskJS(){
    return src(files.jsPath)                // gulp metoden src = vilka sökvägar och därmed filer ska hämtas?
    .pipe(sourceMaps.init())                // startar upp möjlighet att se källkodens ursprunglig plats (sökväg)
    .pipe(concat('main.js'))                // slår ihop alla js-filerna till en main.js fil 
    .pipe(babel({                           // transpilerar/konvertera till äldre versioner av js
        presets: ['@babel/env']
    }))
    .pipe(terser())                         // minifierar alla js-filer
    .pipe(sourceMaps.write('../maps'))      // skriver källkodens ursprunglig plats (sökväg)
    .pipe(dest('pub/js'));                  // skicka vidare filerna till pub genom att använda metoden .pipe
}

// Task 4 - Typsecript - funktion som transpilerar TS
function taskTypescript() {
    return src(files.tsPath, { sourcemaps:true })
    .pipe(tsProject())
    .pipe(dest("pub/js"));
}

// Task 5 - Images - funktion som kopierar/hämtar över alla bildfiler till publicering (pub)
function taskImages(){
    return src(files.imagePath)             // gulp metoden src = vilka sökvägar och därmed filer ska hämtas? 
    .pipe (imagemin())                      // minifierar bilder
    .pipe(dest('pub/images'));              // skicka vidare filerna till pub genom att använda metoden .pipe
}

// Task 6 - Watch - funktion som kontrollerar/övervakar förändringar 
function taskWatch(){
    browserSync.init({  //initierar browsersynk så att live-server startas upp
        server:"./pub"
    });

    watch([files.htmlPath, files.scssPath, files.jsPath, files.tsPath, files.imagePath], // Övervakar dessa filer
        parallel(taskHTML, taskSCSS, taskJS, taskTypescript, taskImages)).on('change', browserSync.reload); // kör dessa parallellt 

}

// exporterar från private till public i serie 
exports.default = series(
    parallel(taskHTML, taskSCSS, taskJS, taskTypescript, taskImages),  // kör dessa samtidigt/parallellt
    taskWatch // kör därefter funktionen watchTask
    ); 