import React, { Component } from 'react';
import classnames from 'classnames';

class GameForm extends Component {

  state = {
    id: this.props.game ? this.props.game.id : null,
    title: this.props.game ? this.props.game.title : '',
    cover: this.props.game ? this.props.game.cover :  '',
    errors: {},
    loading: false
  }

  // handle state updates
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      id: nextProps.game.id,
      title: nextProps.game.title,
      cover: nextProps.game.cover
    });
  }
    
  handleChange = (e) => {
    if(!!this.state.errors[e.target.name]){
      // clone errors from state to local var
      let errors = Object.assign({}, this.state.errors );
      delete errors[e.target.name];// reset errors object from previous state
      
      this.setState({
        [e.target.name]: e.target.value,
        errors
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    
    // validation
    let errors = {};
    if(this.state.title === '') errors.title = "Can't be empty";
    if(this.state.cover === '') errors.cover = "Can't be empty";
    this.setState({ errors });
    
    const isValid = Object.keys(errors).length === 0;
    
    if(isValid){
      const { id, title, cover } = this.state;
      this.setState({ loading: true });
      this.props.saveGame({id, title, cover})
      .catch((err) => err.response.json().then(({errors}) => this.setState({errors, loading: false})));
      
      
      // instead of duping the logic here - pass to the action and let it handle the situation
      // or we could introduce a page component that will handle this
      // OLD WAY
      // if(id) {
      //   this.props.updateGame({id, title, cover})
      //   .then(
      //     () => {
      //       this.setState({done: true})
      //     },
      //     (err) => err.response.json().then(({errors}) => this.setState({errors, loading: false}))
      //   );
      // } else {
      //   this.props.saveGame({title, cover})
      //   .then(
      //     () => {
      //       this.setState({done: true})
      //     },
      //     (err) => err.response.json().then(({errors}) => this.setState({errors, loading: false}))
      //   );
      // }
      // END OLD WAY
      
    }
  }
  
  render() {
    console.log('MY GAME', this.props.game)
    
    const form = (
      <div>
        <form className={classnames('ui form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
          <h1>Add New Game</h1>
          
          {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>  }
          
          <div className={classnames('field', { error: !!this.state.errors.title })}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
            <span>{this.state.errors.title}</span>
          </div>
          
          <div className={classnames('field', { error: !!this.state.errors.cover })}>
            <label htmlFor="cover">Cover URL</label>
            <input
              id="cover"
              name="cover"
              value={this.state.cover}
              onChange={this.handleChange}
            />
            <span>{this.state.errors.cover}</span>
          </div>
          
          <div className="field">
            { this.state.cover !== '' && <img src={this.state.cover} alt="cover URL" className="ui small bordered image" /> }
          </div>
          
          <div className="field">
            <button className="ui primary button">Save</button>
          </div>
        </form>
      </div>
    );
    
    return (
      <div>
        { form }
      </div>
    );
  }
}

export default GameForm;

/* flow when given an id
1) search redux store for instance with matching id and provide to this component
2) fetch game data from server
3) if no id - then create a new game
 */