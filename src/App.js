import React from 'react';
import "./styles.css";
import reload from './reload.svg';
import memo from './memo.svg';
import erase from './erase.svg';

const Question = [
    [6, 0, 5, 0, 0, 3, 4, 0, 0],
    [7, 0, 3, 0, 0, 5, 0, 8, 2],
    [4, 8, 0, 1, 0, 0, 6, 0, 5],
    [9, 2, 4, 0, 3, 1, 7, 5, 8],
    [0, 0, 0, 9, 0, 8, 2, 0, 3],
    [0, 3, 7, 0, 4, 0, 0, 9, 6],
    [5, 6, 9, 0, 8, 4, 3, 7, 0],
    [2, 7, 1, 3, 0, 0, 8, 6, 4],
    [0, 4, 8, 7, 1, 6, 0, 2, 0],
]

const Answer = [
    [6, 9, 5, 8, 2, 3, 4, 1, 7],
    [7, 1, 3, 4, 6, 5, 9, 8, 2],
    [4, 8, 2, 1, 9, 7, 6, 3, 5],
    [9, 2, 4, 6, 3, 1, 7, 5, 8],
    [1, 5, 6, 9, 7, 8, 2, 4, 3],
    [8, 3, 7, 5, 4, 2, 1, 9, 6],
    [5, 6, 9, 2, 8, 4, 3, 7, 1],
    [2, 7, 1, 3, 5, 9, 8, 6, 4],
    [3, 4, 8, 7, 1, 6, 5, 2, 9],
]

class Cell extends React.Component {
    render() {
        const x = this.props.x;
        const y = this.props.y;
        let className = 'cell';
        if (this.props.board[y][x] === 0) {className += ' space'}
        else if (this.props.answer[y][x] !== this.props.board[y][x]) {className += ' wrong'}
        else if (this.props.question[y][x] === 0) {className += ' input'}

        return <button className={className} onClick={this.props.onClick}>
            {this.props.board[y][x]}
        </button>
    }
}

class Group extends React.Component {
    renderCell(i) {
        const x = 3 * (this.props.value % 3) + i % 3;
        const y = 3 * Math.floor(this.props.value / 3) + Math.floor(i / 3);
        return <Cell
            value={i}
            key={i}
            x={x}
            y={y}
            onClick={() => this.props.onClick([x, y])}
            question={this.props.question}
            answer={this.props.answer}
            board={this.props.board}
        />
    }

    render() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const cols = [];
            for (let j = 0; j < 3; j++) {
                cols.push(this.renderCell(i * 3 + j))
            }
            rows.push(<div className='table-row' key={i}>{cols}</div>)
        }
        return (<div className='group'>{rows}</div>);
    }
}

class Board extends React.Component {
    renderGroup(i) {
        return <Group
            value={i}
            key={i}
            onClick={(x) => this.props.onClick(x)}
            question={this.props.question}
            answer={this.props.answer}
            board={this.props.board}
        />
    }

    render() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const cols = [];
            for (let j = 0; j < 3; j++) {
                cols.push(this.renderGroup(i * 3 + j))
            }
            rows.push(<div className='table-row' key={i}>{cols}</div>)
        }
        return (<div className='board'>{rows}</div>);
    }
}

class Operator extends React.Component {
    render() {
        return (
            <div className='operator'>
                <button onClick={() => this.props.onClickReload()}>
                    <img src={reload} alt='reload' />
                </button>
                <button  className={this.props.selectedMemo ? 'highlight' : undefined} onClick={() => this.props.onClickMemo()}>
                    <img src={memo} alt='memo' />
                </button>
                <button  className={this.props.selectedErase ? 'highlight' : undefined} onClick={() => this.props.onClickErase()}>
                    <img src={erase} alt='erase' />
                </button>
            </div>
        )
    }
}

class Numbers extends React.Component {
    renderNumbers(i) {
        return <button key={i} className={i === this.props.selectedNumber ? 'highlight' : undefined} onClick={() => this.props.onClick(i)}>
            {i}
        </button>
    }

    render() {
        const numbers = []
        for(let i = 1; i <= 9; i++) {
            numbers.push(this.renderNumbers(i))
        }
        return (
            <div className='numbers'>
                {numbers}
            </div>
        )
    }
}

class Sudoku extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: Question.slice(),
            answer: Answer.slice(),
            board: Array(9).fill(0).map(row => new Array(9).fill(0)),
            selectedNumber: 0,
            selectedMemo: false,
            selectedErase: false,
        }
    }

    onClickCell([x, y]) {
        let board = this.state.board.slice();
        if (this.state.selectedErase && this.state.question[y][x] === 0) {
            board[y][x] = 0;
        }
        else if (this.state.selectedNumber) {
            board[y][x] = this.state.selectedNumber;
        }
        else {

        }

        this.setState({
            board: board,
        })
    }

    onClickNumber(i) {
        this.setState({
            selectedNumber: i,
            selectedErase: false,
        })
    }


    onClickReload() {
        const question = this.state.question.slice();
        const answer = this.state.answer.slice();
        let board = this.state.board.slice()
        for (let i=0; i<9; i++) {
            for (let j=0; j<9; j++) {
                board[i][j] = question[i][j]
            }
        }
        this.setState({
            question: question,
            answer: answer,
            board: board,
            selectedNumber: 0,
            selectedMemo: false,
            selectedErase: false,
        })
    }

    onClickMemo() {
        this.setState({
            selectedMemo: !this.state.selectedMemo,
        })
    }

    onClickErase() {
        this.setState({
            selectedNumber: 0,
            selectedErase: !this.state.selectedErase,
        })
    }

    render() {
        return (
            <div>
                <div>
                    <Board
                        question={this.state.question}
                        answer={this.state.answer}
                        board={this.state.board}
                        onClick={(x) => this.onClickCell(x)}
                    />
                </div>
                <div>
                    <Operator
                        onClickReload={() => this.onClickReload()}
                        onClickMemo={() => this.onClickMemo()}
                        selectedMemo={this.state.selectedMemo}
                        onClickErase={() => this.onClickErase()}
                        selectedErase={this.state.selectedErase}
                    />
                </div>
                <div>
                    <Numbers 
                        onClick={(i) => this.onClickNumber(i)}
                        selectedNumber={this.state.selectedNumber}
                    />
                </div>
            </div>
        )
    }
}

export default function App() {
    return (
        <Sudoku />
    );
}
