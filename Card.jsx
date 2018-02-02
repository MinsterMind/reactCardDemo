import React from 'react';
import {InfiniteScroll} from 'react-simple-infinite-scroll'
import WordInput from './wordInput.jsx'
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
            word: '',//this.props.data.word,
            meaning:'',//this.props.data.meaning.join(','),
            synonyms:'',//this.props.data.synonyms.join(',')
            updateForm: (<WordInput isUpdate="true" isOpen="false"/>)
        }
    }
    componentDidMount () {
        this.setState({
            word: this.props.data.word,
            meaning: this.props.data.meaning.join(','),
            synonyms: this.props.data.synonyms.join(','),
        })
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


    cancelUpdate() {
        this.setState({isUpdate: false})
    }
    render() {

        if (!this.state.isUpdate) {
            return (
                <label>
                    <input type="checkbox" className="invisible"/>
                    <div className="card">
                        <div className="front">{this.state.word}
                            <span className="updateButtons">
                        <button onClick={this.getUpdateForm.bind(this)}>Update</button>
                        <button onClick={this.deleteWord.bind(this)}>Delete</button>
                    </span>
                        </div>
                        <div className="back">
                            Meaning: {JSON.stringify(this.state.meaning)}<br/>
                            Synonyms: {JSON.stringify(this.state.synonyms)}
                        </div>
                    </div>

                </label>
            )
        } else {
             return(
                 <WordInput isUpdate="true" isOpen="true" cancelUpdate={this.cancelUpdate.bind(this)} data={this.props.data} components={this.props.components}/>
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