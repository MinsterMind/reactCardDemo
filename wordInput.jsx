import React from 'react'

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
        fetch('http://localhost:8080/api/word', {
            method: 'post',
            body: JSON.stringify({
                word: this.state.word,
                meaning: this.state.meaning.split(','),
                synonyms: this.state.synonyms.split(',')
            })
        }).then(res => {
                alert('ok')
                location.reload()
            }).catch(err=>{
                alert(err)
        })
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