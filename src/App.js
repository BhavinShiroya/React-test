import React, { Component } from 'react';
import './styles/main.scss';
import 'font-awesome/css/font-awesome.min.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { BrowserRouter as Router } from 'react-router-dom';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let fileReader;
let base64;
class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      numPages: null,
      pageNumber: 1,
      links: [],
      currentIndex: -1
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  // select file and convert it into base64
  selectFile = (e) => {
    let mimeType = "";
    let name = e.target.files[0].name;
    if (e.target.files.length > 0) {
      fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      mimeType = e.target.files[0].type
      fileReader.onload = () => {
        base64 = fileReader.result;
        let links = this.state.links
        links.push({ name: name, url: base64, type: mimeType })
        this.setState({ links: links })
      };
      fileReader.onerror = (error) => {

      };
    }
  }

  render() {
    const { pageNumber, links } = this.state;
    return (
      <Router>
        <div className="flexWrapper">
          <div className="menu">
            <div className="menuHeader">
              <span className="title">FILES</span>
              <span className="upload">Upload <i className="fa fa-upload" aria-hidden="true"></i> <input type="file" onChange={this.selectFile}></input></span>
            </div>
            <ul className="documents">
              {links.map((link, index) =>
                <li
                  key={index}
                  className={`elements ${this.state.currentIndex === index ? 'active' : ''}`}>
                  <div onClick={() => { this.setState({ currentIndex: index }) }}>
                    <h3>{link.name}</h3>
                    <span>Me, Dustin</span>
                  </div>
                </li>)}
            </ul>
          </div>
          <div className="content">
            <div className="contentHeader">
            {this.state.currentIndex > -1 && <h2>{links[this.state.currentIndex].name}</h2>}
            </div>
            <div className="container">
              {this.state.currentIndex > -1 && <React.Fragment>
                {
                  links[this.state.currentIndex].type.match("pdf.*") ?
                    <Document
                      file={`${links[this.state.currentIndex].url}`}
                      onLoadSuccess={this.onDocumentLoadSuccess}
                      onLoadError={console.error}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document> :
                    <iframe title={"text"} src={links[this.state.currentIndex].url} frameBorder="0" height="400" width="50%" />
                }
              </React.Fragment>}
            </div>
          </div>
        </div>
      </Router >
    );
  }
}

export default App;