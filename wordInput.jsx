import React from 'react'
const _ = require('lodash')

class WordInput extends React.Component {
    constructor() {
        super()
        this.state = {
            word:'',
            meaning:'',
            synonyms: '',
            isOpen: false,
            isUpdate: false
        }
    }
    componentDidMount() {
        this.setState({
            isUpdate: this.props.isUpdate,
            isOpen: this.props.isOpen,
            word: (this.props.data && this.props.data.word) || '',
            meaning: (this.props.data && this.props.data.meaning.join(',')) || '',
            synonyms: (this.props.data && this.props.data.synonyms.join(',')) || ''
        })
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSave() {
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
                this.setState({isOpen: false})
            })
        }
    }
    handleUpdate() {
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
    closeForm(){
        this.setState({isOpen: false})
        if(this.props.cancelUpdate) {
            this.props.cancelUpdate()
        }
    }
    openForm(){
        this.setState({isOpen:true})
    }
    render() {
        if (this.state.isOpen){
            return(
                <label>
                <div className="inputForm">
                    Word: <br/>
                    <input type={"text"} name="word" value={this.state.word} onChange={this.handleChange.bind(this)} disabled={this.state.isUpdate}/><br/>
                    Meaning: <br/>
                    <input type={"text"} name="meaning" value={this.state.meaning} onChange={this.handleChange.bind(this)}/><br/>
                    Synonyms: <br/>
                    <input type={"text"} name="synonyms" value={this.state.synonyms} onChange={this.handleChange.bind(this)}/><br/>
                    {this.state.isUpdate ?
                        (<button onClick={this.handleUpdate.bind(this)}>Update</button>):
                        (<button onClick={this.handleSave.bind(this)}>Save</button>)}
                    <a href="#" className="closePopup" onClick={this.closeForm.bind(this)}>x</a>
                </div>
                </label>
            )
        } else {
            return(
            <a href="#" onClick={this.openForm.bind(this)}> Add word</a>
            )
        }

    }
}

export default WordInput