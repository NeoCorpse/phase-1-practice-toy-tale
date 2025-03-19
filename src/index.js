let addToy = false;

document.addEventListener('DOMContentLoaded', () => {
	const addBtn = document.querySelector('#new-toy-btn');
	const toyFormContainer = document.querySelector('.container');
	const collection = document.querySelector('#toy-collection');
	const form = document.querySelector('form');
	const textField = document.querySelector('input');
	const imgField = document.querySelector('input[name="image"]');

	function createElement(toy) {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
      		<h2>${toy.name}</h2>
  			<img src="${toy.image}" class="toy-avatar" />
  			<p>${toy.likes} Likes</p>
  			<button class="like-btn" id="${toy.id}">Like ❤️</button>
    	`;
		div.querySelector('button').addEventListener('click', (e) => {
			let id = e.target.id;
			fetch(`http://localhost:3000/toys/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ likes: ++toy.likes }),
			});
			div.querySelector('p').innerHTML = `${toy.likes} Likes`;
		});
		collection.appendChild(div);
	}

	addBtn.addEventListener('click', () => {
		// hide & seek with the form
		addToy = !addToy;
		if (addToy) {
			toyFormContainer.style.display = 'block';
		} else {
			toyFormContainer.style.display = 'none';
		}
	});

	fetch('http://localhost:3000/toys')
		.then((res) => res.json())
		.then((toys) => {
			toys.forEach(createElement);
		});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		let text = textField.value;
		let url = imgField.value;

		fetch('http://localhost:3000/toys', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				name: text,
				image: url,
				likes: 0,
				id: `${collection.childNodes.length + 1}`,
			}),
		})
			.then((res) => res.json())
			.then((obj) => {
				createElement(obj);
			});

		textField.value = '';
		imgField.value = '';
	});
});
