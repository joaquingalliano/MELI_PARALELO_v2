import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Chat.css';

class Chat extends Component {

    constructor() {
        super();

        this.state = {
            hidden: true,
            messageText: ""
        }
        this.showChat = this.showChat.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);
        this.getMessages = this.getMessages.bind(this);
    }

    componentWillMount() {
        this.getMessages();
    }

    componentDidUpdate() {
        if (!this.state.hidden) {
            const node = this.refs.endMessages;
            if (node) {
                node.scrollIntoView();
            }
        }
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

    sendMessage(e) {
        let user = JSON.parse(localStorage.getItem("user"));
        let message = this.state.messageText;
        let urlChat = "http://localhost:8080/comments";
        let body = JSON.stringify({
            user: user.id,
            description: message
        });

        fetch(urlChat, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body
        })
        .then(() => {
            this.getMessages();
        });

        this.setState({
            messageText: ""
        });
    }

    getMessages() {
        let urlChat = "http://localhost:8080/comments?limit=10"
        fetch(urlChat)
        .then((response) => {return response.json()})
        .then((data) => {
            this.setState({
                messages: data
            });
        });
    }

    handleText(e) {
        let target = e.target;
        let value = target.value;

        this.setState({
            messageText: value
        });
    }

    handleKeyChange(e) {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }

    render() {
        let messages = this.state.messages ? this.state.messages : "";
        let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "";
        let inverseMessages = this.state.messages ? messages.slice(0).reverse() : "";

        if (!user && !this.state.hidden) {
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
                            <h4 style={{"color": "white"}}>Please login..</h4>
                        </div>
                        <div className="chatInputs">
                            <input type="text" maxLength="240" className="chatTextInput" disabled/>
                            <button className="chatButtonInput glyphicon glyphicon-send" disabled></button>
                        </div>
                    </div>
                </div>
            );
        }

        if (!this.state.hidden && user) {
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
                            {
                                inverseMessages.map((mess, index) =>
                                    <Message
                                        key={index}
                                        userID={mess.user.name}
                                        text={mess.description}
                                        owner={ user.id === mess.user.id ? "Own" : "Other" }/>
                                )
                            }
                            <div ref={(el) => this.endMessages = el}></div>
                        </div>
                        <div className="chatInputs">
                            <input type="text" maxLength="240" className="chatTextInput"
                                onKeyPress={this.handleKeyChange}
                                onChange={this.handleText}
                                value={this.state.messageText}/>
                            <button className="chatButtonInput glyphicon glyphicon-send"
                                onClick={this.sendMessage}></button>
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
