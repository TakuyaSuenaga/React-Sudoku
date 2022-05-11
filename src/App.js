import React from 'react';
import './styles.css';
import reload from './reload.svg'
import memo from './memo.svg'
import erase from './erase.svg'

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

const NINE_INDEXES = [...Array(9)].map((_, i) => i);
const NINE_NUMBERS = [...Array(9)].map((_, i) => i + 1);

function NineTable(props) {
    const rows = []
    for (let i = 0; i < 3; i++) {
        const cols = []
        for (let j = 0; j < 3; j++) {
            cols.push(<div className='nine-table-item' key={j}>{props.contents[i * 3 + j]}</div>)
        }
        rows.push(<div className='nine-table-row' key={i}>{cols}</div>)
    }
    return <div className='nine-table'>{rows}</div>
}

class Memo extends React.Component {
    render() {
        return (
            <div className='memo'>
                {this.props.visible && this.props.isChecked ? this.props.value : undefined}
            </div>
        )
    }
}

class Square extends React.Component {
    isImpossible([x, y]) {
        if (this.props.info.selectedNumber === 0) {
            return false
        }
        for (let i = 0; i < 9; i++) {
            if (this.props.info.board[i][x] === this.props.info.selectedNumber ||
                this.props.info.board[y][i] === this.props.info.selectedNumber) {
                return true
            }
        }
        const xx = 3 * Math.floor(x / 3)
        const yy = 3 * Math.floor(y / 3)
        for (let i = xx; i < xx + 3; i++) {
            for (let j = yy; j < yy + 3; j++) {
                if (this.props.info.board[j][i] === this.props.info.selectedNumber) {
                    return true
                }
            }
        }
        return false
    }

    touch([x, y]) {
        let className = 'touch'
        if (this.props.info.answer[y][x] !== this.props.info.board[y][x]) {className += ' wrong'}
        else if (this.props.info.question[y][x] === 0) {className += ' input'}
        return className
    }

    square([x, y]) {
        let className = 'square'
        if (this.isImpossible([x, y])) {className += ' impossible'}
        if (this.props.info.selectedNumber !== 0 && this.props.info.board[y][x] === this.props.info.selectedNumber) {className += ' selected'}
        return className
    }

    renderMemo(i) {
        const x = 3 * (this.props.groupNo % 3) + this.props.squareNo % 3;
        const y = 3 * Math.floor(this.props.groupNo / 3) + Math.floor(this.props.squareNo / 3);
        const visible = (this.props.info.board[y][x] === 0)
        return <Memo key={i} value={i+1} isChecked={this.props.info.memo[y][x][i]} visible={visible} />
    }

    render() {
        const x = 3 * (this.props.groupNo % 3) + this.props.squareNo % 3;
        const y = 3 * Math.floor(this.props.groupNo / 3) + Math.floor(this.props.squareNo / 3);
        const value = this.props.info.board[y][x];
        return (
            <div className={this.square([x, y])} onClick={() => this.props.onClickSquare([x, y])}>
                <NineTable contents={NINE_INDEXES.map(i => this.renderMemo(i))} />
                <div className={this.touch([x, y])}>{value === 0 ? undefined : value}</div>
            </div>
        )
    }
}

class Group extends React.Component {
    renderSquare(i) {
        return (
            <Square
                groupNo={this.props.groupNo}
                squareNo={i}
                key={i}
                info={this.props.info}
                onClickSquare={(x) => this.props.onClickSquare(x)}
                onClickMemoCheck={(x) => this.props.onClickMemoCheck(x)}
            />
        )
    }

    render() {
        return (
            <div className='group'>
                <NineTable contents={NINE_INDEXES.map(x => this.renderSquare(x))} />
            </div>
        )
    }
}

class Board extends React.Component {
    renderGroup(i) {
        return (
            <Group
                groupNo={i}
                key={i}
                info={this.props.info}
                onClickSquare={(x) => this.props.onClickSquare(x)}
                onClickMemoCheck={(x) => this.props.onClickMemoCheck(x)}
            />
        )
    }

    render() {
        return (
            <div className='board'>
                <NineTable contents={NINE_INDEXES.map(x => this.renderGroup(x))} />
            </div>
        )
    }
}

class Numbers extends React.Component {
    renderNumber(i) {
        return <button key={i} className={i === this.props.selectedNumber ? 'highlight' : undefined} onClick={() => this.props.onClick(i)}>
            {i}
        </button>
    }

    render() {
        return (
            <div className='numbers'>
                {NINE_NUMBERS.map(x => this.renderNumber(x))}
            </div>
        )
    }
}

class Operators extends React.Component {
    render() {
        return (
            <div className='operators'>
                <button className='operator' onClick={this.props.onClickReload}>
                    <img src={reload} alt='reload'></img>
                </button>
                <button className={this.props.info.selectedMemo ? 'operator highlight' : 'operator'} onClick={this.props.onClickMemo}>
                    <img src={memo} alt='memo'></img>
                </button>
                <button className={this.props.info.selectedErase ? 'operator highlight' : 'operator'} onClick={this.props.onClickErase}>
                    <img src={erase} alt='erase'></img>
                </button>
            </div>
        )
    }
}

class Sudoku extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedNumber: 0,
            selectedMemo: false,
            selectedErase: false,
            question: Question,
            answer: Answer,
            board: Array(9).fill(0).map(row => new Array(9).fill(0)),
            memo: Array(9).fill(0).map(row => new Array(9).fill(0).map(row => new Array(9).fill(false))),
        }
    }

    onClickSquare([x, y]) {
        let board = this.state.board.slice();
        let memo = this.state.memo.slice();
        const isEditable = (this.state.question[y][x] === 0);
        const erase = this.state.selectedErase;
        const number = this.state.selectedNumber;
        if (!isEditable) {
            return
        }
        if (this.state.selectedMemo) {
            if (erase && number) {
                memo[y][x][number-1] = false;
            }
            else if (number) {
                memo[y][x][number-1] = true;
            }
            else {
                return
            }
        }
        else {
            if (erase) {
                board[y][x] = 0;
            }
            else if (number) {
                board[y][x] = number;
            }
            else {
                return
            }
        }

        this.setState({
            board: board,
            memo: memo,
        })
    }

    onClickMemoCheck([x, y]) {
        let memo = this.state.memo.slice();
        const selectedNumber = this.state.selectedNumber;
        if (selectedNumber === 0) {
            return
        }

        memo[y][x][selectedNumber-1] = true;

        this.setState({
            memo: memo,
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
            memo: Array(9).fill(0).map(row => new Array(9).fill(0).map(row => new Array(9).fill(false))),
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
            selectedErase: !this.state.selectedErase,
        })
    }

    onClickNumber(i) {
        this.setState({
            selectedNumber: i,
            selectedErase: false,
        })
    }

    render() {
        return <div className='sudoku'>
            <Board
                info={this.state}
                onClickSquare={(x) => this.onClickSquare(x)}
                onClickMemoCheck={(x) => this.onClickMemoCheck(x)}
            />
            <Operators
                info={this.state}
                onClickReload={() => this.onClickReload()}
                onClickMemo={() => this.onClickMemo()}
                onClickErase={() => this.onClickErase()}
            />
            <Numbers
                onClick={(i) => this.onClickNumber(i)}
                selectedNumber={this.state.selectedNumber}
            />
        </div>
    }
}

// ========================================

export default function App() {
    return (
        <Sudoku />
    );
}
