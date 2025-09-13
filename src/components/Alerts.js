import {Component} from "react"
import DailyForecast from "./DailyForecast.js";
import WeatherInput from "./WeatherInput.tsx";

class Alerts extends Component {

    constructor(props) {
        super(props);
        this.slideIndex = 1;

        this.state = {
            close: props.close,
            error: null,
        }
        this.click = this.click.bind(this);
        this.alert = this.alert.bind(this);
        this.close = this.close.bind(this);
        this.showSlides = this.showSlides.bind(this);
    }
  click(nr) {
    this.slideIndex += nr
    this.showSlides(this.slideIndex)
  };
  alert(nr) {
    this.slideIndex = nr
    this.showSlides(this.slideIndex)
  };
  showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if(slides === null || slides.length === 0) return;
    if (n > slides.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    if(slides[this.slideIndex-1]) {
      slides[this.slideIndex-1].style.display = "block";
      const dot = dots[this.slideIndex - 1];
        if (dot) {
          dot.classList.add("active");
        }
    }
  }
  close() {
    this.setState( prev => ({...prev, close: true}))
  };
    render() {

      const { error, close } = this.state;
      let data  = this.props.data;

       console.log(`render Alerts ${data}`)
        if(data == null || data.length == 0) { 
             return <></>
        }
        else {
          let s = new Map();
          data.forEach(d => s.set(`${d.city}${d.msg}`,d))
          data = [];
          s.forEach( v=> data.push(v))
        }
        if(close){
          return <></>
        }
        if(close && this.props.close)
          return <></>

        return (
            <div className="alert-container">
              <div className="slideshow-container">
                <div className="close-alert" onClick={this.close}>✖</div>
                {
                  data.map( alert => {
                    {console.log(alert.city, alert.msg)}
                    return (
                    <div className="mySlides fade" key={alert.city+alert.msg}>
                      <div className="text"><div className="title">{alert.city}</div>{alert.msg} </div>
                    </div>)
                  })
                }
                <a className="prev" onClick={() => this.click(-1)}>&#10094;</a>
                <a className="next" onClick={() => this.click(1)}>&#10095;</a>
              </div>  

            <div style={{"textAlign":`center`}}>
              {
                data.map((al, i) => {
                  {console.log(al.city, i)}
                  return (<span className="dot" onClick={() => this.alert(i+1)} key={al.msg}></span>)
                })
              }
            </div>
            </div>
        );
    }
    componentDidMount() {
      const  data  = this.props.data;
      //console.log(data)
      if(data)
        this.showSlides(this.slideIndex);
    }
    componentDidUpdate(prevProps, prevState) {
      const  data  = this.props.data;
      console.log(`Update Alerts `,this.state.close, this.props.close)
      if (this.state.close === true  && this.props.close === false && prevState.close === true) {
         this.setState( prev => ({...prev, close: false}))
    }
      if(data)
        this.showSlides(this.slideIndex);
    }
}

export default Alerts;