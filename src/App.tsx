import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
// gave interface a boolean property (showGraph) in order to make it 
// valid and conditionally renderable further down in the code
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
// set the initial state of the app to not to show the graph 
//(showGraph: false). //We want the graph to show once the 
//user has clicked "start streaming data"
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child 
      // element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  // set this method to only render the graph once showGraph's property 
  //is 'true', so that once the user clicks the 'start streaming' 
  //button, that will trigger the graph to start rendering.
  renderGraph() {
    if (this.state.showGraph) {
    return (<Graph data={this.state.data}/>)
  }
}

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0;
    const interval = setInterval(() => {
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // Previous data in the state and the new data from server
      // Also, set the property 'showGraph' to true, so that the app
      // starts to display the graph once the data from the server comes
      // back to the requestor.
      this.setState({ data: serverResponds, showGraph: true, });
    });
    x++;
    if (x > 1000) {
      clearInterval(interval);
    }
  }, 100);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
