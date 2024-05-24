import {useEffect, useRef, useState} from 'react';
import './searchable-dropdown.css';


/**
 * Component that allows users to search and select
 * items from a dropdown list with the ability to filter
 * and display selected items.
 * @return {*} – Renders the components
 */
const SearchableDropdown = ({
	options,
	label,
	id,
	selectedVal,
	handleChange,
}) => {
	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);

	const getSavedIngredients = async () => {
		const response = await fetch('/api/grab');
		if (response) {
			const data = await response.json();
			setSelectedItems(data['ingredients']);
			handleChange(data['ingredients']);
		}
	};

	useEffect(() => {
		getSavedIngredients();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []
	);

	const inputRef = useRef(null);

	useEffect(() => {
		document.addEventListener('click', toggle);
		return () => document.removeEventListener('click', toggle);
	}, []);

	const selectOption = (option) => {
		setQuery('');
		setIsOpen(false);

		/**
		 * If the option is already selected, remove it; otherwise,
		 * add it to the list
		*/
		const updatedSelectedItems = selectedItems.includes(option[label]) ?
			selectedItems.filter((item) => item !== option[label]) :
			[...selectedItems, option[label]];

		setSelectedItems(updatedSelectedItems);
		handleChange(updatedSelectedItems);
	};

	const deselectItem = (item) => {
		const updatedSelectedItems = selectedItems.filter(
			(selectedItem) => selectedItem !== item
		);
		setSelectedItems(updatedSelectedItems);
		handleChange(updatedSelectedItems);
	};

	/**
 * The function `toggle` sets the state of `isOpen`
 * based on whether the event target is the same as
 * the `inputRef` current value.
 * @param {String} e - An event object that is passed to
 * the function when it is triggered by an event listener.
 */
	function toggle(e) {
		setIsOpen(e && e.target === inputRef.current);
	}

	const filter = (options) => {
		return options.filter(
			(option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
		);
	};

	return (
		<div className="dropdown">
			<div className="control">
				<div className="selected-value">
					<input
						ref={inputRef}
						type="text"
						placeholder="Search Ingredients"
						value={query}
						name="searchTerm"
						onChange={(e) => setQuery(e.target.value)}
						onClick={toggle}
					/>
				</div>
				<div className={`arrow ${isOpen ? 'open' : ''}`}></div>
			</div>

			<div className={`options ${isOpen ? 'open' : ''}`}>
				{filter(options).map((option, index) => (
					<div
						onClick={() => selectOption(option)}
						className={`option ${
							selectedItems.includes(option[label]) ? 'selected' : ''
						}`}
						key={`${id}-${index}`}
					>
						{option[label]}
					</div>
				))}
			</div>

			<div className='selected-title'>Selected Ingredients:</div>
			<div className="selected-items">
				{selectedItems.map((item, index) => (
					<div className="selected-item" key={`selected-${index}`}>
						<span>{item}</span>
						<span onClick={() => deselectItem(item)}>✖️</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default SearchableDropdown;
