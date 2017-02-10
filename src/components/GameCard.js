import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal, {closeStyle} from 'simple-react-modal'
import './modal.css';

class GameCard extends Component {
  
  constructor(){
    super();
    this.state = {
      showDeleteModal:false
    }
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.deleteSelectedGame = this.deleteSelectedGame.bind(this);
  }
  
  toggleDeleteModal(e){
    this.setState({showDeleteModal: !this.state.showDeleteModal})
  }
  
  deleteSelectedGame(e) {
    this.props.deleteGame(this.props.game.id);
    this.toggleDeleteModal(null);
  }
  
  render() {
    // console.log('CARD', this.props)
    
    return (
      <div className="ui card">
        <Modal
          className="modal-background" //this will completely overwrite the default css completely
          //style={{}} //overwrites the default background
          //containerStyle={{}} //changes styling on the inner content area
          containerClassName="modal-foreground"
          closeOnOuterClick={true}
          show={this.state.showDeleteModal}
          //transitionSpeed={1000}
          onClose={(e) => this.toggleDeleteModal(e)}>
          <div className="modal-content">
            <div className="modal-header">
              <a style={closeStyle} onClick={(e) => this.toggleDeleteModal(e)}>X</a>
            </div>
            <div className="modal-body">Are you sure you want to delete <strong>{this.props.game.title}</strong>?</div>
            <div className="modal-footer">
              <div className="ui two buttons">
                <a className="ui button green" onClick={(e) => this.deleteSelectedGame(e)}>Yes</a>
                <a className="ui button red" onClick={(e) => this.toggleDeleteModal(e)}>No</a>
              </div>
            </div>
          </div>
        </Modal>
        
        <div className="image">
          <img src={this.props.game.cover} alt="Game Cover"/>
        </div>
        <div className="content">
          <div className="header">{this.props.game.title}</div>
        </div>
        <div className="extra content">
          <div className="ui two buttons">
            <Link to={`/game/${this.props.game.id}`} className="ui basic button green">Edit</Link>
            <a className="ui basic button red" onClick={(e) => this.toggleDeleteModal(e)}>Delete</a>
          </div>
        </div>
      </div>
    );
  }
}

GameCard.propTypes = {
  game: React.PropTypes.object.isRequired,
  deleteGame: React.PropTypes.func.isRequired
}

export default GameCard;