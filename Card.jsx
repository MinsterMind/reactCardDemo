import React from 'react';
import {InfiniteScroll} from 'react-simple-infinite-scroll'
const _ = require('lodash')


// React component for the front side of the card
class CardFront extends React.Component {
    constructor(){
        super()
        this.state = {
            isLoading: true,
            cursor:0,
            data: []
        }
    }

    componentDidMount() {
        this.loadData()
    }
    loadData() {

        this.setState({isLoading: true})
        fetch(`http://localhost:8080/api/word?pageNumber=${this.state.cursor}&pageLimit=5`)
            .then(res => res.json())
            .then(res => {
                    this.setState(state =>({
                        data: [...this.state.data, ...res],
                        cursor: res.length>0?this.state.cursor+1:null,
                        isLoading: false
                    }))

                })

    }

    rerenderCards() {
        this.setState({
            isLoading: true,
            cursor:0,
            data: []
        })
        this.loadData()
    }

    render() {
        return (
            <div>

                <InfiniteScroll
                    throttle={1}
                    threshold={60}
                    isLoading={this.state.isLoading}
                    hasMore={!!this.state.cursor}
                    onLoadMore={this.loadData.bind(this)}
                >
                    {this.state.data.length>0 ? this.state.data.map((word, i) => <Card key = {i} data = {word} components={{cardList:this}}/>)
                    :null}
                </InfiniteScroll>
                {this.state.isLoading && (<MyLoadingState/>)}
            </div>
        )
    }
}

class Card extends React.Component {

    constructor() {
        super()
        this.state = {
            isUpdate: false,
            word:'',
            meaning:'',
            synonyms: ''
        }
    }
    deleteWord() {
        fetch(`http://localhost:8080/api/word/${this.props.data.word}`, {
            method:'delete'
        }).then(res => {
            alert('deleted')
            this.props.components.cardList.rerenderCards()
        })
    }
    getUpdateForm() {
        this.setState({isUpdate: true})
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    handleClick() {
        var meaning = _.compact(this.state.meaning.split(','))
        var synonyms = _.compact(this.state.synonyms.split(','))
        if (_.isEmpty(meaning) || _.isEmpty(synonyms)) {
            alert('Meaning and Synonyms can not be empty')
        } else {
            fetch('http://localhost:8080/api/word', {
                method: 'put',
                body: JSON.stringify({
                    word: this.props.data.word,
                    meaning: meaning,
                    synonyms: synonyms
                })
            }).then(res => {
                this.props.components.cardList.rerenderCards()
            }).catch(err=>{
                alert(err)
            })
        }
    }
    cancelUpdate() {
        this.setState({isUpdate: false})
    }
    render() {
        if (!this.state.isUpdate) {
            return (
                <label>
                    <input type="checkbox" className="invisible"/>
                    <div className="card">
                        <div className="front">{this.props.data.word}
                            <span className="updateButtons">
                        <button onClick={this.getUpdateForm.bind(this)}>Update</button>
                        <button onClick={this.deleteWord.bind(this)}>Delete</button>
                    </span>
                        </div>
                        <div className="back">
                            Meaning: {JSON.stringify(this.props.data.meaning)}<br/>
                            Synonyms: {JSON.stringify(this.props.data.synonyms)}
                        </div>
                    </div>

                </label>
            )
        } else {
             return(
                <label>
                    Word: <br/>
                    <input type={"text"} name="word" value={this.props.data.word} disabled="true"/><br/>
                    Meaning: <br/>
                    <input type={"text"} name="meaning"  onChange={this.handleChange.bind(this)}/><br/>
                    Synonyms: <br/>
                    <input type={"text"} name="synonyms"  onChange={this.handleChange.bind(this)}/><br/>
                    <button onClick={this.handleClick.bind(this)}>Update</button>
                    <button onClick={this.cancelUpdate.bind(this)}>Cancel</button>
                </label>
            )
        }
    }
}

class MyLoadingState extends React.Component {
    render() {
        return(
            <div>Loading...</div>
        )
    }
}
export default CardFront