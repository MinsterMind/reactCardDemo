import React from 'react'
const _ = require('lodash')

class WordInput extends React.Component {
    constructor() {
        super()
        this.state = {
            word:'',
            meaning:'',
            synonyms: ''
        }
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleClick() {
        var meaning = _.compact(this.state.meaning.split(','))
        var synonyms = _.compact(this.state.synonyms.split(','))
        if(_.isEmpty(meaning) || _.isEmpty(synonyms) ||_.isEmpty(this.state.word)) {
            alert('Word, meaning or synonym can not be empty')
        } else {
            // console.log(this.props)
            fetch('http://localhost:8080/api/word', {
                method: 'post',
                body: JSON.stringify({
                    word: this.state.word,
                    meaning: this.state.meaning.split(','),
                    synonyms: this.state.synonyms.split(',')
                })
            }).then(res => {
                if(!res.ok) {
                    alert('duplicate word')
                }
                this.props.components.cardList.rerenderCards()
            })
        }
    }
    render() {
        return(
            <div>
                Word: <br/>
                <input type={"text"} name="word" onChange={this.handleChange.bind(this)}/><br/>
                Meaning: <br/>
                <input type={"text"} name="meaning" onChange={this.handleChange.bind(this)}/><br/>
                Synonyms: <br/>
                <input type={"text"} name="synonyms" onChange={this.handleChange.bind(this)}/><br/>
                <button onClick={this.handleClick.bind(this)}>Save</button>
            </div>
        )
    }
}

export default WordInput