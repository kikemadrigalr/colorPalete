//declarar los valores de css de las custom properties (colores) en css
window.CSS.registerProperty({
  name: "--primary",
  syntax: "<color>", //tipo de syntaxis
  inherits: true, //es heredable
  initialValue: "#ffd924",
});

window.CSS.registerProperty({
  name: "--secondary",
  syntax: "<color>", //tipo de syntaxis
  inherits: true, //es heredable
  initialValue: "#ffd924",
});

window.CSS.registerProperty({
  name: "--tertiary",
  syntax: "<color>", //tipo de syntaxis
  inherits: true, //es heredable
  initialValue: "#ffd924",
});

window.CSS.paintWorklet.addModule("bezel.js");

const form = document.querySelector("#form");
form.addEventListener("submit", handleSubmit);

//capturar el evento submit y aplicar FormData
async function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(form);
  console.log("obtener datos Pokemon");
  const id = data.get("id");
  console.log("pokemon", id);
  const pokemon = await getPokemon(id);
  console.log("dibujar pokemon");
  const pokemonDrawed = await renderPokemon(pokemon);
  console.log("obtener paleta");
  const colors = draw.colorPalette(90);
  updateProperties(colors);
}

//conectarme al api y obtener el pokemon
async function getPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();
  return pokemon;
}

class Draw {
  //el constructor de la clase recibe el elemento canvas
  constructor(canvasEl) {
    this.canvas = canvasEl;
    //crear una nueva imagen
    this.ctx = this.canvas.getContext("2d");
    this.image = new Image();
    this.image.setAttribute("crossOrigin", "anonymous");
  }

  render(url) {
    this.image.setAttribute("src", url);
    this.ctx.font = "30px sans-serif";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Loading!...", 0, 0, this.canvas.width);
    return new Promise((resolve, reject) => {
      this.image.addEventListener("load", () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
          this.image,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        resolve("Listo para obtener los colores");
      });
    });
  }

  //obtener los colores segun la imagen que se cargue en el canvas
  colorPalette(quality = 90) {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ).data;
    const colors = [];

    for (
      let i = 0;
      i < this.canvas.width * this.canvas.height;
      i = i + quality
    ) {
      const offset = i * 4;
      const alpha = imageData[offset + 3];

      if (alpha > 0) {
        //hay color
        const red = imageData[offset];
        const green = imageData[offset + 1];
        const blue = imageData[offset + 2];
        colors.push({ red, green, blue });
        console.log("%c color", `background: rgba(${red}, ${green}, ${blue})`); //colorear en la consola
      }
    }
    // console.log(imageData);
    return colors;
  }
}

const draw = new Draw(canvas);

//dibujar pokemon en el canvas
async function renderPokemon(pokemon) {
  await draw.render(pokemon.sprites.front_default);
  return draw;
}

//solo se toman los primeros tres colores que vienen en el arreglos, pueden ser muchos mas
function updateProperties(colors) {
  document.body.style.setProperty(
    "--primary",
    `rgb(${colors[0].red}, ${colors[0].green}, ${colors[0].blue})`
  );
  document.body.style.setProperty(
    "--secondary",
    `rgb(${colors[1].red}, ${colors[1].green}, ${colors[1].blue})`
  );
  document.body.style.setProperty(
    "--tertiary",
    `rgb(${colors[2].red}, ${colors[2].green}, ${colors[2].blue})`
  );
}
