import React from 'react';
import Die from './Die'
import { nanoid } from 'nanoid'

import Confetti from 'react-confetti'

export default function App() {

	const [dice, setDice] = React.useState(allNewDice())
	const [tenzies, setTenzies] = React.useState(false)
	const [rollCount, setRollCount] = React.useState(0)
	const [time, setTime] = React.useState(0)
	const [bestTime, setBestTime] = React.useState(
		JSON.parse(localStorage.getItem('bestTime')) || []
	)

	React.useEffect(function () {
		const allHeld = dice.every(die => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every(die => die.value === firstValue)
		if(allHeld && allSameValue) {
			setTenzies(true)
		}
	}, [dice])

	// Effect to count the current time 
	React.useEffect(() => {
		if (!tenzies) {
			let tick = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
			return () => {
				clearInterval(tick);
			};
		} else {
			setTime((prevTime) => prevTime);
		}
	}, [tenzies]);
	
	// Effect to count bestTime
	React.useEffect(() => {
		const currentBestTime = localStorage.getItem("bestTime")
		if(tenzies) {
			if(!currentBestTime) {
				localStorage.setItem('bestTime', JSON.stringify(time))
			} else if (time < currentBestTime) {
				setBestTime(time)
			}
		}
	}, [tenzies, time])

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		}
	}

	function allNewDice() {
		const newDice = []
		for (let i = 0; i < 10; i++) {
			newDice.push(
				generateNewDie()
			)
		}
		return newDice
	}

	function rollDice() {
		if (!tenzies) {
			setDice(prevDice => prevDice.map(die => {
				return die.isHeld ? 
				die :
				generateNewDie()
			}));
			// function to count how many roll you have done
			setRollCount((prevCount) => prevCount + 1);
		} else {
			setTenzies(false)
			setRollCount(0)
			setDice(allNewDice())
			setTime(0)
			setBestTime(localStorage.getItem('bestTime'))
		}
	}

	function holdDice(id) {
		setDice(prevDice => prevDice.map(die => {
			return die.id === id ? 
				{...die, isHeld: !die.isHeld} :
				die
		}))
	}

	const diceElement = dice.map(die => 
	<Die
		isHeld={die.isHeld}
		key={die.id}
		value={die.value}
		holdDice={() => holdDice(die.id)}
	/>
)


	return (
		<main>
			{tenzies && <Confetti />}
			<h1 className='title'>Tenzies</h1>
			<p className='instructions'>Roll until all dice are the same. Click each die to freeze it at
				its current value between rolls. <br></br> Try to get the
				fastest time!
			</p>
			<div className='counter'>
				<div className='counters'>
					<div className='counter-title'>Rolls</div>
					<span className='counter-value'>{rollCount}</span>
				</div>
				<div className='counters'>
					<div className='counter-title'>Best Time</div>
					<span className='counter-value'>{bestTime}s</span>
				</div>
				<div className='counters'>
					<div className='counter-title'>Current Time</div>
					<span className='counter-value'>{time}s</span>
				</div>
			</div>
			<div className='dice-wrapper'>
				{diceElement}
			</div>
			<button
				className='roll-dice'
				onClick={rollDice}
			>
				{tenzies ? 'New Game' : "Roll"}
			</button>
			<div className='footer'>Created by <a href="https://github.com/OleksandrShakhov" target="_blank">Oleksandr Shakhov</a></div>
		</main>
	);
}
