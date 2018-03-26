import React, {Component} from 'react';
import './Chat.css';

class Chat extends Component {

    constructor() {
        super();

        this.state = {
            hidden: true
        }
        this.showChat = this.showChat.bind(this);
    }

    showChat(e) {
        let newState = this.state.hidden ? false : true;
        if (newState) {
            document.body.style.overflow = "auto";
        }
        else {
            document.body.style.overflow = "hidden";
        }
        this.setState({hidden: newState});
    }

    render() {
        if (!this.state.hidden) {
            return (
                <div>
                    <div className="chatBackground" onClick={this.showChat}></div>
                    <div className="chatContainer">
                        <button type="button"
                            style={{transform: "translateX(-250px)"}}
                            className="btnChat glyphicon glyphicon-chevron-right"
                            onClick={this.showChat}
                        ></button>
                        <div className="chatMessages">
                            <Message userID="Pele" text="Hey hey heyyyyy Hey hey heyyyyy Hey hey heyyyyy" owner="Other"/>
                            <Message userID="Yo" text="BITCONNEEECTBITCONNEEECTBITCONNEEECTBITCONNEEECT" owner="Own"/>
                        </div>
                        <div className="chatInputs">
                            <input type="text" maxLength="240" className="chatTextInput" />
                            <button className="chatButtonInput glyphicon glyphicon-send"></button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <button type="button"
                className="btnChat glyphicon glyphicon-chevron-left"
                onClick={this.showChat}
            ></button>
        );
    }
}

class Message extends Component {
    render() {
        let userID = this.props.userID;
        let text = this.props.text;
        let className = "chatMessage" + this.props.owner;

        return (
            <div className={className}>
                <div className="chatMessageUser">{userID}</div>
                <p className="chatMessageText">
                    {text}
                </p>
            </div>
        );
    }
}

export default Chat;
