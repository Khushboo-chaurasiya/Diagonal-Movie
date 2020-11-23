import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieList from './components/MovieList';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <MovieList />
      </div>
      
    )
  }
}