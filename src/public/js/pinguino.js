  /* Basado en el pingüino del Challenge de FreeCodeCamp
 ** sobre CSS, variables, colores.
 */
class Pinguino extends React.Component {
  constructor(props) {
    super(props);
    const color = [this.props.skin];
    if (this.props.skin === "black") {
      color.push("white");
      color.push("orange");
    } else if (this.props.skin === "white") {
      color.push("black");
      color.push("orange");
    } else {
      color.push("white");
      color.push("orange");
    }
    this.state = {
      tamano: this.props.size,
      posX: this.props.x,
      posY: this.props.y,
      skin: color[0],
      cheek: color[1],
      pico: color[2],
      picoMov: 65,
      habla: false,
      pies: color[2],
      ojos: this.props.eyes,
      sparkles: 35,
      blush: "transparent",
      manoDer: 45,
      manoIzq: 45,
      pieDer: 80,
      pieIzq: 80 };

    this.saltar = this.saltar.bind(this);
    this.correrDer = this.correrDer.bind(this);
    this.correrIzq = this.correrIzq.bind(this);
    this.correr = this.correr.bind(this);
    this.saludarDer = this.saludarDer.bind(this);
    this.saludarIzq = this.saludarIzq.bind(this);
    this.hablar = this.hablar.bind(this);
    this.pancita = this.pancita.bind(this);
    this.accionar = this.accionar.bind(this);
  }
  saltar() {
    const salto = [100, 45];
    this.setState({
      posY: this.state.posY - 5,
      manoIzq: salto[0],
      manoDer: salto[0],
      pieDer: this.state.pieDer - 20,
      pieIzq: this.state.pieIzq - 20 });

    setTimeout(() => {
      this.setState({
        posY: this.state.posY + 5,
        manoIzq: salto[1],
        manoDer: salto[1],
        pieDer: this.state.pieDer + 20,
        pieIzq: this.state.pieIzq + 20 });

    }, 1000);
  }
  correrDer() {
    const correr = [80, 45];
    this.setState({
      posX: this.state.posX - 5,
      manoDer: correr[0],
      pieDer: this.state.pieDer - 20 });

    setTimeout(() => {
      this.setState({
        posX: this.state.posX + 5,
        manoDer: correr[1],
        pieDer: this.state.pieDer + 20 });

    }, 1000);
  }
  correrIzq() {
    const correr = [80, 45];
    this.setState({
      posX: this.state.posX + 5,
      manoIzq: correr[0],
      pieIzq: this.state.pieIzq - 20 });

    setTimeout(() => {
      this.setState({
        posX: this.state.posX - 5,
        manoIzq: correr[1],
        pieIzq: this.state.pieIzq + 20 });

    }, 1000);
  }
  correr() {
    if (Math.random() > 0.5) {
      this.correrDer();
    } else {
      this.correrIzq();
    }
  }
  saludarDer() {
    const saludo = [90, 45];
    this.setState({ manoDer: saludo[0], blush: "pink" });
    setTimeout(() => {
      this.setState({ manoDer: saludo[1], blush: "transparent" });
    }, 1000);
  }
  saludarIzq() {
    const saludo = [90, 45];
    this.setState({ manoIzq: saludo[0], blush: "pink" });
    setTimeout(() => {
      this.setState({ manoIzq: saludo[1], blush: "transparent" });
    }, 1000);
  }
  pancita() {
    this.setState({
      cheek: "skyblue",
      blush: "pink",
      sparkles: this.state.sparkles + 15 });

    setTimeout(() => {
      this.setState({
        cheek: "white",
        blush: "transparent",
        sparkles: this.state.sparkles - 15 });

    }, 1000);
  }
  hablar() {
    if (this.state.habla) {
      clearInterval(this.hablarMas);
      this.setState({ picoMov: 65 });
    } else {
      this.hablarMas = setInterval(() => {
        this.setState({ picoMov: this.state.picoMov + 3 });
        setTimeout(() => {
          this.setState({ picoMov: this.state.picoMov - 3 });
        }, 250);
      }, 500);
    }
    this.setState({ habla: !this.state.habla });
  }
  accionar() {
    switch (this.props.accion) {
      case 0:
        this.saltar();
        break;
      case 1:
        this.correr();
        break;
      case 2:
        this.correrDer();
        break;
      case 3:
        this.correrIzq();
        break;
      case 4:
        this.saludarDer();
        break;
      case 5:
        this.saludarIzq();
        break;
      case 6:
        this.pancita();
        break;
      case 7:
        this.hablar();
        break;}

  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "penguin" }, /*#__PURE__*/
      React.createElement("style", { type: "text/css" },
      `
.penguin {
    position: relative;
    display: block;
    margin-top: ${this.state.posY}vh;
    width: ${this.state.tamano}px;
    height: ${this.state.tamano}px;
		transition: all 0.5s;
  } 
  .penguin-top {
    top: 10%;
    left: 25%;
    background: ${this.state.skin};   
    width: 50%;
    height: 45%;
    border-radius: 70% 70% 60% 60%;
  }
  
  .penguin-bottom {
    top: 40%;
    left: 23.5%;
    background: ${this.state.skin};
    width: 53%;
    height: 45%;
    border-radius: 70% 70% 100% 100%;
  }
  .right-hand {
    top: 0%;
    left: -5%;
    background: ${this.state.skin};
    width: 30%;
    height: 60%;
    border-radius: 30% 30% 120% 30%;
    transform: rotate(${this.state.manoDer}deg);
    z-index: -1;
  }
  
  .left-hand {
    top: 0%;
    left: 75%;
    background: ${this.state.skin};
    width: 30%;
    height: 60%;
    border-radius: 30% 30% 30% 120%;
    transform: rotate(-${this.state.manoIzq}deg);
    z-index: -1;
  }
  
  .right-cheek {
    top: 15%;
    left: 35%;
    background: ${this.state.cheek};
    width: 60%;
    height: 70%;
    border-radius: 70% 70% 60% 60%;
  }
  
  .left-cheek {
    top: 15%;
    left: 5%;
    background: ${this.state.cheek};
    width: 60%;
    height: 70%;
    border-radius: 70% 70% 60% 60%;
  }
  
  .belly {
    top: 60%;
    left: 2.5%;
    background: ${this.state.cheek};
    width: 95%;
    height: 100%;
    border-radius: 120% 120% 100% 100%;
  }
  
  .right-feet {
    top: 85%;
    left: 60%;
    background: ${this.state.pies};
    width: 15%;
    height: 30%;
    border-radius: 50% 50% 50% 50%;
    transform: rotate(-${this.state.pieDer}deg);
    z-index: -2222;  
  }
  
  .left-feet {
    top: 85%;
    left: 25%;
    background: ${this.state.pies};
    width: 15%;
    height: 30%;
    border-radius: 50% 50% 50% 50%;
    transform: rotate(${this.state.pieIzq}deg);
    z-index: -2222;  
  }
  
  .left-eye {
    top: 45%;
    left: 60%;
    background: ${this.state.ojos};
    width: 15%;
    height: 17%;
    border-radius: 50%; 
  }
  
  .right-eye {
    top: 45%;
    left: 25%;
    background: ${this.state.ojos};
    width: 15%;
    height: 17%;
    border-radius: 50%;
  }
  
  .sparkle {
    top: 25%;
    left: 15%;
    background: ${this.state.ojos === "white" ? "black" : "white"};
    width: ${this.state.sparkles}%;
    height: ${this.state.sparkles}%;
    border-radius: 50%;
  }
  
  .blush-right {
    top: 65%;
    left: 15%;
    background: ${this.state.blush};
    width: 15%;
    height: 10%;
    border-radius: 50%;
  }
  
  .blush-left {
    top: 65%;
    left: 70%;
    background: ${this.state.blush};
    width: 15%;
    height: 10%;
    border-radius: 50%;
  }
  
  .beak-top {
    top: 60%;
    left: 40%;
    background: ${this.state.pico};
    width: 20%;
    height: 10%;
    border-radius: 50%;
  }
  
  .beak-bottom {
    top: ${this.state.picoMov}%;
    left: 42%;
    background: ${this.state.pico};
    width: 16%;
    height: 10%;
    border-radius: 50%;
  }
  .penguin * {
    position: absolute;
		transition: all 0.5s;
  }
`), /*#__PURE__*/

      React.createElement("div", { className: "penguin-bottom", onClick: this.correr }, /*#__PURE__*/
      React.createElement("div", { className: "right-hand", onClick: this.saludarDer  }), /*#__PURE__*/
      React.createElement("div", { className: "left-hand", onClick: this.saludarIzq }), /*#__PURE__*/
      React.createElement("div", { className: "right-feet" }), /*#__PURE__*/
      React.createElement("div", { className: "left-feet" })), /*#__PURE__*/

      React.createElement("div", { className: "penguin-top" }, /*#__PURE__*/
      React.createElement("div", { className: "right-cheek", onClick: this.saltar }), /*#__PURE__*/
      React.createElement("div", { className: "left-cheek", onClick: this.saltar }), /*#__PURE__*/
      React.createElement("div", { className: "belly", onClick: this.pancita }), /*#__PURE__*/
      React.createElement("div", { className: "right-eye", onClick: this.saludarDer }, /*#__PURE__*/
      React.createElement("div", { className: "sparkle" })), /*#__PURE__*/

      React.createElement("div", { className: "left-eye", onClick: this.saludarIzq }, /*#__PURE__*/
      React.createElement("div", { className: "sparkle" })), /*#__PURE__*/

      React.createElement("div", { className: "blush-right"}), /*#__PURE__*/
      React.createElement("div", { className: "blush-left" }), /*#__PURE__*/
      React.createElement("div", { className: "beak-top", onClick: this.hablar }), /*#__PURE__*/
      React.createElement("div", { className: "beak-bottom", onClick: this.hablar }))));



  }}

Pinguino.defaultProps = {
  size: 400,
  x: 30,
  y: 20,
  skin: "rgb(45,45,45)",
  eyes: "midnightblue" };

ReactDOM.render( /*#__PURE__*/React.createElement(Pinguino, null), document.getElementById("App"));
