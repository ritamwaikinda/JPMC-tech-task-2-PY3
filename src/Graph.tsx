import React, { Component } from 'react';
import { Table } from '@jpmorganchase/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
// Extending the HTMLElement class from the PerspectiveViewElement,
// so that the PerspectiveViewElement can behave like an HTMLElement.
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    // updated definition of elem straight to the result 
    // of document.getElementsByTagName, since HTMLElement
    // is now already extended to PerspectiveViewerElement.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;
    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.

      // Added more Perspective configurations here.
      // assigned view with a y_line value so the graph will
      //render as a continuous line.
      elem.setAttribute('view', 'y_line');
      //assigned column-pivots with stock value so we can distinguish
      // stock ABC with DEF.
      elem.setAttribute('column-pivots', '["stock"]');
      //assigned row-pivots the timestamp value so we can map each 
      //datapoint along the x-axis based on the timestamp it has.
      elem.setAttribute('row-pivots', '["timestamp"]');
      //set column to only focus on top_ask_price data of stock.
      elem.setAttribute('columns', '["top_ask_price"]');
      // set aggregates to consolidate duplicate data into one data point.
      elem.setAttribute('aggregates', `{"stock":"distinct count", "top_ask_price":"avg", "top_bid_price":"avg", "timestamp":"distinct count"}`);
      elem.load(this.table);
    }
  }

  componentDidUpdate() {
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
